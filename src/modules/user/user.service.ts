import jwt, { JwtPayload } from "jsonwebtoken";

import makeAllowedFieldData from "../../utils/allowedFieldUpdatedData";
import makeFlattenedObject from "../../utils/makeFlattenedObject";
import { allowedFieldsToUpdate, searchableFields } from "./user.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";

import httpStatus from "http-status";

import sendImageToCloudinary from "../../utils/sendImageToCloudinary";
import { TfileUpload } from "../../interface/fileUploadType";
import config from "../../app/config";
import AppError from "../../utils/appError";
import QueryBuilder from "../../builders/QueryBuilder";

/**
 * ----------------------- Create an user----------------------
 * @param file image file to upload (optional)
 * @param payload new user data
 * @returns return newly created user
 */
const createAnUserIntoDB = async (file: TfileUpload, payload: TUser) => {
  // set default password if password is not provided
  payload.password = payload.password || (config.default_password as string);

  // check if the user already exists
  const user = await User.findOne({ email: payload.email });
  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  // set profileImg if image is provided
  // if (file) {
  //   const imageName = `${payload.email}-${payload.name.firstName}`;
  //   const path = file.path;
  //   const uploadedImage: any = await sendImageToCloudinary(path, imageName);
  //   payload.profileImg = uploadedImage.secure_url;
  // }

  // set placeholder image if image is not provided
  if (!file || payload.profileImg === "") {
    payload.profileImg =
      "https://avatar.iran.liara.run/public/boy?username=Ash";
  }

  const result = await User.create(payload);
  return result;
};

/**
 * ----------------------- get all users ----------------------
 * @return return all users
 */
const getAllUsersFromDB = async (query: Record<string, any>) => {
  const userQuery = new QueryBuilder(User.find({ isDeleted: false }), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldsLimiting();
  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;
  return { meta, result };
};

/**
 * -----------------  get me  -----------------
 * @param email email address
 * @param role user role
 * @returns own user data based on jwt payload data
 */
const getMe = async (email: string, role: string) => {
  const result = await User.findOne({ email, role });
  return result;
};

/**
 * --------------- delete an user form db ----------------
 * @param id user id
 * @returns return deleted user data
 */
const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

/**
 * --------------- update an user form db ----------------
 * @param id user id
 * @param payload update user data
 * @featurs admin can change own and user data. user can change own data only
 * @returns return updated user data
 */
const updateUserIntoDB = async (
  currentUser: JwtPayload,
  id: string,
  payload: Partial<TUser>
) => {
  // check if the user exists not deleted or blocked
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "Requested user not found!");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User is already deleted!");
  }
  if (user.status === "blocked") {
    throw new AppError(httpStatus.NOT_FOUND, "User is already blocked!");
  }

  // check if current logged user and request not same and role is user.
  // means an user cna not update another user data
  if (currentUser.email !== user?.email && currentUser.role === "user") {
    throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  // filter allowed fileds only
  const allowedFieldData = makeAllowedFieldData<TUser>(
    allowedFieldsToUpdate,
    payload
  );
  // make flattened object
  const flattenedData = makeFlattenedObject(allowedFieldData);

  const result = await User.findByIdAndUpdate(id, flattenedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

/**
 * -------------------- change user status ----------------------
 * @param id user id
 * @param payload user status payload
 * @validatios check if the user exists,not deleted. only admin can change user status
 * @validations main admin can't change own status
 * @returns return updated user status
 */
const changeUserStatusIntoDB = async (
  id: string,
  payload: { status: string }
) => {
  // check if user exists, not deleted
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }
  // check the user is not main admin
  if (user.email === "admin@gmail.com") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are main admin, can't change your status"
    );
  }

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

/**
 * -------------------- change user role ----------------------
 * @param id user id
 * @param payload user role payload
 * @validatios check if the user exists,not deleted. only admin can change user role
 * @note admin can not change own role. admin can change only user role
 *  @validations main admin can't change own status
 * @returns return updated user data
 */
const changeUserRoleIntoDB = async (id: string, payload: { role: string }) => {
  // check if user exists, not deleted. find user that has role as user
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not found!");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is already deleted!");
  }

  // check the user is not main admin
  if (user.email === "admin@gmail.com") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are main admin, can't change role!"
    );
  }

  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const UserServices = {
  createAnUserIntoDB,
  getAllUsersFromDB,
  getMe,
  deleteUserFromDB,
  updateUserIntoDB,
  changeUserStatusIntoDB,
  changeUserRoleIntoDB,
};
