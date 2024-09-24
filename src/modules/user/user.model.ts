import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, TUser, TUserName } from "./user.interface";
import config from "../../app/config";
import AppError from "../../utils/appError";
import httpStatus from "http-status";

const userNameSchema = new Schema<TUserName>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

// create user schema
const userSchema = new Schema<TUser, IUser>(
  {
    name: { type: userNameSchema, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 1,
    },
    passwordChangedAt: { type: Date },
    age: { type: Number, required: true },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "others"],
    },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "blocked"],
      default: "active",
    },
    profileImg: { type: String },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

// ----------- pre middleware hook to hash password -----------
userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

// ----------- hide password to client response -----------
userSchema.post("save", function (doc) {
  doc.password = "";
});

// ----------- hide password to client response -----------
userSchema.post("find", function (docs) {
  docs.forEach((doc: TUser) => {
    doc.password = "";
  });
});

// ----------- hide password to client response -----------
userSchema.post("findOneAndUpdate", function (doc) {
  doc.password = "";
});

/**
 * @param email email address of an user
 * @returns return user data found by email address
 */
userSchema.statics.isUserExistsByemail = async function (email: string) {
  const result = await User.findOne({ email }).select("+password");
  return result;
};

/**
 * @param _id user id provided mongodb
 * @validation if user is deleted, throw an error
 * @returns return user data if it's not deleted
 */
userSchema.statics.isUserExistsById = async function (_id: string) {
  const result = await User.findById(_id).select("+password");
  if (result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already deleted");
  }
  return result;
};

// ----------- isPasswordMatch statics methods -----------
userSchema.statics.isPasswordMatch = async function (
  plainPassword: string,
  hashedPassword: string
) {
  const result = await bcrypt.compare(plainPassword, hashedPassword);
  return result;
};

// ----------- check is jwt issued before password change -----------
userSchema.statics.isJWTIssuedBeforePasswordChange = function (
  passwordChangedTimestamp: Date,
  jwtIssuedtimestamp: number
) {
  // UTC datetime to milliseconds
  const passwordChangedtime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedtime > jwtIssuedtimestamp;
};

// make a model and export
export const User = model<TUser, IUser>("User", userSchema);
