import { model } from "mongoose";
import { mongooseContactSchema } from "../../schemas/contact-schemas.js";

mongooseContactSchema.pre("findOneAndUpdate", function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
});

mongooseContactSchema.post("findOneAndUpdate", (error, data, next) => {
  error.status = 400;
  next();
});

mongooseContactSchema.post("save", (error, data, next) => {
  error.status = 400;
  next();
});

const ContactModel = model("contact", mongooseContactSchema);

export default ContactModel;
