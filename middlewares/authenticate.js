import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/index.js";
import UserModel from "../models/contacts/User.js"

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(HttpError(401, "Authorization not define"));
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Invalid authorization field"));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);

    const user = await UserModel.findById(id);
    if (!user || !user.token || token !== user.token) {
      return next(HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

export default authenticate;
