import express from "express";
import authController from "../../controllers/auth-controller";
import { isEmptyBody } from "../../middlewares";
import { validateBody } from "../../decorators";
import { userSchema } from "../../schemas/user-schemas";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, validateBody(userSchema), authController.singUp);

export default authRouter;