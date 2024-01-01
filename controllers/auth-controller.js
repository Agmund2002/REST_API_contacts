import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/contacts/User";
import { HttpError } from "../helpers";
import { ctrlWrapper } from "../decorators";

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

  res.json({
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

  const user = await UserModel.findById(id);
  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  await UserModel.findByIdAndUpdate(id, { token: "" });

  res.sendStatus(204);
};

export default {
  singUp: ctrlWrapper(singUp),
  singIn: ctrlWrapper(singIn),
  signOut: ctrlWrapper(signOut),
};
