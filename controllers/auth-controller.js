import bcrypt from "bcrypt";
import UserModel from "../models/contacts/User";
import { HttpError } from "../helpers";
import { ctrlWrapper } from "../decorators";

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

export default {
  singUp: ctrlWrapper(singUp),
};
