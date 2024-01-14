import express from "express";
import authController from "../../controllers/auth-controller.js";
import { authenticate, deleteOldAvatar, isEmptyBody, upload } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import { updateSubscriptionSchema, userSchema } from "../../schemas/user-schemas.js";

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, validateBody(userSchema), authController.singUp);

authRouter.post("/login", isEmptyBody, validateBody(userSchema), authController.singIn);

authRouter.post("/logout", authenticate, authController.signOut);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.patch("/subscription", authenticate, validateBody(updateSubscriptionSchema), authController.updateSubscription);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), deleteOldAvatar, authController.updateAvatar);

export default authRouter;