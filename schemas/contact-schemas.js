import Joi from "joi";
import { Schema } from "mongoose";

const emailRegExp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const phoneRegExp = /^\(\d{3}\)\s\d{3}-\d{4}$/;

export const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `missing required name field`,
  }),
  email: Joi.string().pattern(emailRegExp).required().messages({
    "any.required": `missing required email field`,
  }),
  phone: Joi.string().pattern(phoneRegExp).required().messages({
    "any.required": `missing required phone field`,
  }),
  favorite: Joi.boolean(),
});

export const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().pattern(emailRegExp),
  phone: Joi.string().pattern(phoneRegExp),
  favorite: Joi.boolean(),
});

export const mongooseContactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      match: emailRegExp,
      required: true,
    },
    phone: {
      type: String,
      match: phoneRegExp,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);
