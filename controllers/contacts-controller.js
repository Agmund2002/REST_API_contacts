import ContactModel from "../models/contacts/Contact.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite = false } = req.query;
  const skip = (page - 1) * limit;

  let contacts = null;

  if (favorite) {
    contacts = await ContactModel.find(
      { owner, favorite },
      { skip, limit }
    ).populate("owner", "email", "subscription");
  } else {
    contacts = await ContactModel.find(
      { owner },
      { skip, limit }
    ).populate("owner", "email", "subscription");
  }

  res.json({
    page,
    limit,
    total: contacts.length,
    totalPages: Math.ceil(this.total / limit),
    contacts,
  });
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const contact = await ContactModel.findOne({ contactId, owner });
  if (contact === null) {
    throw HttpError(404);
  }

  res.json(contact);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;

  const newContact = await ContactModel.create({ ...req.body, owner });

  res.status(201).json(newContact);
};

const removeById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const removeContact = await ContactModel.findOneAndDelete({
    contactId,
    owner,
  });
  if (removeContact === null) {
    throw HttpError(404);
  }

  res.json({
    message: "Contact deleted",
  });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  const changes = await ContactModel.findOneAndUpdate(
    { contactId, owner },
    req.body
  );
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
