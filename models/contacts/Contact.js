import { model } from "mongoose";
import { mongooseContactSchema } from "../../schemas/contact-schemas.js";

const ContactModel = model("contact", mongooseContactSchema);

export default ContactModel;