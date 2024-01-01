import Joi from "joi";
import { Schema } from "mongoose";

const emailRegExp =
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const phoneRegExp = /^\(\d{3}\)\s\d{3}-\d{4}$/;

export const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required name field",
  }),
  email: Joi.string().pattern(emailRegExp).required().messages({
    "string.pattern.base":
      "wrong format. correct email format: example@mail.com",
    "any.required": "missing required email field",
  }),
  phone: Joi.string().pattern(phoneRegExp).required().messages({
    "string.pattern.base": "wrong format. correct phone format: (NNN) NNN-NNNN",
    "any.required": "missing required phone field",
  }),
  favorite: Joi.boolean(),
});

export const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string()
    .pattern(emailRegExp)
    .message("wrong format. correct email format: example@mail.com"),
  phone: Joi.string()
    .pattern(phoneRegExp)
    .message("wrong format. correct phone format: (NNN) NNN-NNNN"),
  favorite: Joi.boolean(),
});

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "missing field favorite",
  }),
});

export const mongooseContactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      match: [emailRegExp, "Doesn't match the format: example@mail.com"],
      required: [true, "Set email for contact"],
    },
    phone: {
      type: String,
      match: [phoneRegExp, "Doesn't match the format: (NNN) NNN-NNNN"],
      required: [true, "Set phone for contact"],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false }
);
