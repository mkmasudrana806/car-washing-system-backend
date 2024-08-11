import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUserModel, TUser } from "./user.interface";
import config from "../../app/config";
import AppError from "../../utils/appError";
import httpStatus from "http-status";

// user schema
const userSchema = new Schema<TUser, IUserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      select: 0, // hide password field in client response
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
    },
    address: { type: String, required: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// *************** document middleware start **************
userSchema.pre("save", async function (next) {
  // hassing password and save into DB
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

// ****************** statics methods ***************************
// isUserExistsByemail method
userSchema.statics.isUserExistsByemail = async function (email: string) {
  const result = await User.findOne({ email }).select("+password");
  return result;
};
// isUserExistsById find by mongoose _id
userSchema.statics.isUserExistsById = async function (_id: string) {
  const result = await User.findById(_id).select("+password");
  if (result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already deleted");
  }
  return result;
};

// isPasswordMatched
userSchema.statics.isPasswordMatched = async function (
  plain: string,
  hash: string
) {
  const result = await bcrypt.compare(plain, hash);
  return result;
};

// jwt invalidates
userSchema.statics.isJWTIssuedBeforePasswordChange = function (
  passwordChangedTimestamp: Date,
  jwtIssuedtimestamp: number
) {
  // UTC datetime to milliseconds
  const passwordChangedtime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedtime > jwtIssuedtimestamp;
};

// set empty string after saving password
userSchema.post("save", function (doc) {
  doc.password = "";
});

// user model export
export const User = model<TUser, IUserModel>("User", userSchema);
