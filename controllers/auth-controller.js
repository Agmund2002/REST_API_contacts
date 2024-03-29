import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";
import UserModel from "../models/contacts/User.js";
import { HttpError, sendEmail, verificationLetter } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

const singUp = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email, { d: "monsterid" });
  const verificationToken = nanoid();

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModel.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = verificationLetter(email, verificationToken);
  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const singIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const { _id: id } = user;
  const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "1w" });
  const activeUser = await UserModel.findByIdAndUpdate(id, { token });

  res.json({
    token: activeUser.token,
    user: {
      email: activeUser.email,
      subscription: activeUser.subscription,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await UserModel.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  const { _id: id } = user;
  await UserModel.findByIdAndUpdate(id, {
    verify: true,
    verificationToken: null,
  });

  res.json({
    message: "Verification successful",
  });
};

const reVerify = async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = verificationLetter(email, user.verificationToken);
  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
}

const signOut = async (req, res) => {
  const { _id: id } = req.user;

  await UserModel.findByIdAndUpdate(id, { token: "" });

  res.status(204).json("");
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const updateSubscription = async (req, res) => {
  const { _id: id } = req.user;

  const changes = await UserModel.findByIdAndUpdate(id, req.body);

  res.json({
    email: changes.email,
    subscription: changes.subscription,
  });
};

const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "File not found");
  }

  const { _id: id } = req.user;
  const { path: oldPath, filename } = req.file;

  const avatar = await Jimp.read(oldPath);
  avatar.resize(250, 250).write(oldPath);

  const newName = `${id}_${filename}`;
  const avatarsPath = path.resolve("public", "avatars");
  const newPath = path.join(avatarsPath, newName);

  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("avatars", newName);

  const changes = await UserModel.findByIdAndUpdate(id, { avatarURL });

  res.json({
    avatarURL: changes.avatarURL,
  });
};

export default {
  singUp: ctrlWrapper(singUp),
  singIn: ctrlWrapper(singIn),
  verify: ctrlWrapper(verify),
  reVerify: ctrlWrapper(reVerify),
  signOut: ctrlWrapper(signOut),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
