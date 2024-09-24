import express from "express";
import { AuthValidations } from "./auth.validations";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequestData";
const router = express.Router();

// login an user
router.post(
  "/login",
  validateRequest(AuthValidations.loginUserSchema),
  AuthController.loginUser
);

// change user password
router.post(
  "/change-password",
  auth("user", "admin"),
  validateRequest(AuthValidations.changeUserPasswordSchema),
  AuthController.changeUserPassword
);

// forgot password
router.post(
  "/forgot-password",
  validateRequest(AuthValidations.forgotPasswordSchema),
  AuthController.forgotPassword
);

// reset password
router.post(
  "/reset-password",
  validateRequest(AuthValidations.resetPasswordSchema),
  AuthController.resetPassword
);

// refresh token setup
router.post(
  "/refresh-token",
  validateRequest(AuthValidations.refreshTokenSchema),
  AuthController.refreshTokenSetup
);

export const AuthRoutes = router;
