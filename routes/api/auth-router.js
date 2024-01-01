import express from "express";
import authController from "../../controllers/auth-controller";
import { authenticate, isEmptyBody } from "../../middlewares";
import { validateBody } from "../../decorators";
import { userSchema } from "../../schemas/user-schemas";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, validateBody(userSchema), authController.singUp);

authRouter.post("/login", isEmptyBody, validateBody(userSchema), authController.singIn);

authRouter.post("/logout", authenticate, authController.signOut);

authRouter.get("/current", authenticate, authController.getCurrent);

export default authRouter;