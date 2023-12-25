import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import { validateBody } from "../../decorators/index.js";
import { addSchema, updateSchema, updateFavoriteSchema } from "../../schemas/contact-schemas.js";
import { isEmptyBody, isValidId } from '../../middlewares/index.js'

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:contactId", isValidId, contactsController.getById);

contactsRouter.post("/", isEmptyBody, validateBody(addSchema), contactsController.add);

contactsRouter.delete("/:contactId", isValidId, contactsController.removeById);

contactsRouter.put("/:contactId", isValidId, isEmptyBody, validateBody(updateSchema), contactsController.updateById);

contactsRouter.patch("/:contactId/favorite", isValidId, validateBody(updateFavoriteSchema), contactsController.updateById);

export default contactsRouter;
