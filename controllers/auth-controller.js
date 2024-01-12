import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/contacts/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

const singUp = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModel.create({
    ...req.body,
    password: hashPassword,
  });

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
}

export default {
  singUp: ctrlWrapper(singUp),
  singIn: ctrlWrapper(singIn),
  signOut: ctrlWrapper(signOut),
  getCurrent: ctrlWrapper(getCurrent),
  updateSubscription: ctrlWrapper(updateSubscription),
};
