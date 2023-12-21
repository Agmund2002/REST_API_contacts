import contactsService from "../models/contacts/index.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const contacts = await contactsService.listContacts();
  res.json(contacts);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactsService.getContactById(contactId);
  if (contact === null) {
    throw HttpError(404);
  }
  res.json(contact);
};

const add = async (req, res) => {
  const newContact = await contactsService.addContact(req.body);
  res.status(201).json(newContact);
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const removeContact = await contactsService.removeContact(contactId);
  if (removeContact === null) {
    throw HttpError(404);
  }
  res.json({
    message: "Contact deleted",
  });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const changes = await contactsService.updateContact(contactId, req.body);
  if (changes === null) {
    throw HttpError(404);
  }
  res.json(changes);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  removeById: ctrlWrapper(removeById),
  updateById: ctrlWrapper(updateById),
};
