import { model } from "mongoose";
import { mongooseUserSchema } from "../../schemas/user-schemas.js";

mongooseUserSchema.pre("findOneAndUpdate", function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
});

mongooseUserSchema.post("findOneAndUpdate", (error, data, next) => {
  error.status = 400;
  next();
});

mongooseUserSchema.post("save", (error, data, next) => {
  error.status = 400;
  next();
});

const UserModel = model("user", mongooseUserSchema);

export default UserModel;