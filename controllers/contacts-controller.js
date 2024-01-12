import ContactModel from "../models/contacts/Contact.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite = false } = req.query;
  const skip = (page - 1) * limit;

  let total;
  let contacts;

  if (favorite) {
    total = await ContactModel.countDocuments({ favorite });
    contacts = await ContactModel.find({ owner, favorite }, "", {
      skip,
      limit,
    }).populate("owner", ["email", "subscription"]);
  } else {
    total = await ContactModel.countDocuments();
    contacts = await ContactModel.find({ owner }, "", { skip, limit })
      .populate("owner", ["email", "subscription"]);
  }

  res.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    contacts,
  });
};

const getById = async (req, res) => {
  const { contactId: _id } = req.params;
  const { _id: owner } = req.user;

  const contact = await ContactModel.findOne({ _id, owner })
    .populate("owner", ["email", "subscription"]);
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
  const { contactId: _id } = req.params;
  const { _id: owner } = req.user;

  const removeContact = await ContactModel.findOneAndDelete({
    _id,
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
  const { contactId: _id } = req.params;
  const { _id: owner } = req.user;

  const changes = await ContactModel.findOneAndUpdate(
    { _id, owner },
    req.body
  ).populate("owner", ["email", "subscription"]);;
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
