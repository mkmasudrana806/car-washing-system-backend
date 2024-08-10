// handle request and response.
import { NextFunction, Request, RequestHandler, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

// ------------------ get all users ------------------
const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All users are retrived successfully",
    data: result,
  });
});

// ------------------ get single user ------------------
const getSingleUser = catchAsync(async (req, res) => {
  const result = await UserServices.getSingleUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User is retrived successfully",
    data: result,
  });
});

// ------------------ delete an user ------------------
const deleteUser = catchAsync(async (req, res) => {
  const result = await UserServices.deleteUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User is deleted successfully",
    data: result,
  });
});

// ------------------ update an user ------------------
const updateUser = catchAsync(async (req, res) => {
  const result = await UserServices.updateUserIntoDB(req.params.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User is updated successfully",
    data: result,
  });
});

// export all users controllers
export const UserControllers = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
};
