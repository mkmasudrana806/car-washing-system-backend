import httpStatus from "http-status";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { TfileUpload } from "../../interface/fileUploadType";

// ------------------- create an user -------------------
const createAnUser = catchAsync(async (req, res, next) => {
  const result = await UserServices.createAnUserIntoDB(
    req.file as TfileUpload,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

// ------------------- get all users -------------------
const getAllUsers = catchAsync(async (req, res, next) => {
  const { meta, result } = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All users retrieved successfully",
    meta: meta,
    data: result,
  });
});

// ------------------- get me -------------------
const getMe = catchAsync(async (req, res, next) => {
  const { email, role } = req.user;
  const result = await UserServices.getMe(email, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is retrieved successfully",
    data: result,
  });
});

// ------------------- delete an user -------------------
const deleteUser = catchAsync(async (req, res, next) => {
  const result = await UserServices.deleteUserFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is deleted successfully",
    data: result,
  });
});

// ------------------- update an user -------------------
const updateUser = catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  const result = await UserServices.updateUserIntoDB(
    currentUser,
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is updated successfully",
    data: result,
  });
});

// ------------------- change user status -------------------
const changeUserStatus = catchAsync(async (req, res, next) => {
  const result = await UserServices.changeUserStatusIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status is changed successfull",
    data: result,
  });
});

// ------------------- change user role -------------------
const changeUserRole = catchAsync(async (req, res, next) => {
  const result = await UserServices.changeUserRoleIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role  changed successfully",
    data: result,
  });
});

export const UserControllers = {
  createAnUser,
  getAllUsers,
  getMe,
  deleteUser,
  updateUser,
  changeUserStatus,
  changeUserRole,
};
