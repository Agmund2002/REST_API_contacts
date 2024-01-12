import Joi from "joi";
import { Schema } from "mongoose";

const emailRegExp =
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const subscriptionList = ["starter", "pro", "business"];

export const userSchema = Joi.object({
  email: Joi.string().pattern(emailRegExp).required().messages({
    "string.pattern.base":
      "wrong format. correct email format: example@mail.com",
    "any.required": "missing required email field",
  }),
  password: Joi.string().min(6).required().messages({
    "any.required": "missing required password field",
  }),
  subscription: Joi.string().valid(...subscriptionList),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required()
    .messages({
      "any.required": "missing field subscription",
    }),
});

export const mongooseUserSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
      minlength: 6,
    },
    email: {
      type: String,
      match: [emailRegExp, "Doesn't match the format: example@mail.com"],
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter",
    },
    token: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
