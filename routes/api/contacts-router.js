import express from "express";
import contactsController from "../../controllers/contacts-controller.js";
import { validateBody } from "../../decorators/index.js";
import { addSchema, updateSchema } from "../../schemas/contact-schemas.js";
import { isEmptyBody } from '../../middlewares/index.js'

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:contactId", contactsController.getById);

contactsRouter.post("/", isEmptyBody, validateBody(addSchema), contactsController.add);

contactsRouter.delete("/:contactId", contactsController.removeById);

contactsRouter.put("/:contactId", isEmptyBody, validateBody(updateSchema), contactsController.updateById);

export default contactsRouter;
