import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import config from "../../app/config";

// --------------- register or signup an user --------------------
const registerUser = catchAsync(async (req, res) => {
  const result = await authServices.RegisterUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User is registered successfully",
    data: result,
  });
});

// --------------- login an user --------------------
const loginUser = catchAsync(async (req, res) => {
  const { user, accessToken, needsPasswordChange } =
    await authServices.loginUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is logged in successfully",
    token: accessToken,
    data: user,
  });
});

// --------------- change password --------------------
const changePassword = catchAsync(async (req, res) => {
  const result = await authServices.changePasswordIntoDB(
    req.user as JwtPayload,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User password is changed successfully",
    data: result,
  });
});

export const authControllers = {
  registerUser,
  loginUser,
  changePassword,
};
