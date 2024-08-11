import httpStatus from "http-status";
import AppError from "../../utils/appError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../app/config";
import { createToken } from "./auth.utils";
import { TUser } from "../user/user.interface";

// ----------------- register user into database -----------------------
const RegisterUserIntoDB = async (payload: TUser) => {
  // check if the user is exists
  const user = await User.isUserExistsByemail(payload?.email);
  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is already exists!");
  }

  const result = await User.create(payload);
  return result;
};

// ----------------- login user into database -----------------------
const loginUserIntoDB = async (payload: TLoginUser) => {
  // check if the user is exists
  const user: any = await User.isUserExistsByemail(payload?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }
  console.log(user);
  // check if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }

  // checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is not matched!");
  }

  // jwt data
  const jwtPayload = {
    userId: user?._id,
    email: user?.email,
    role: user?.role,
  };

  // access granted: Send AccessToken
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    user,
    accessToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

// --------------- change password --------------------
const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // check if the user is exists
  const user = await User.isUserExistsByemail(userData.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }

  // check if the user is already deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }

  // checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is not matched!");
  }

  // hash the new password
  const hashPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  // update the password
  const result = await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: hashPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true, runValidators: true }
  );

  return result;
};

export const authServices = {
  RegisterUserIntoDB,
  loginUserIntoDB,
  changePasswordIntoDB,
};
