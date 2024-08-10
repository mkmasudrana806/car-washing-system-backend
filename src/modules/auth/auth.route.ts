import express from "express";
import validateRequest from "../../middlewares/validateRequestData";
import { authValidations } from "./auth.validation";
import { authControllers } from "./auth.controller";

import { USER_ROLE } from "./auth.constant";
import { UserValidations } from "../user/user.validation";
import auth from "../../middlewares/auth";
const router = express.Router();

// register an user
router.post(
  "/signup",
  validateRequest(UserValidations.createUserValidationSchema),
  authControllers.registerUser
);

// login an user
router.post(
  "/login",
  validateRequest(authValidations.loginValidationSchema),
  authControllers.loginUser
);

// change password
router.post(
  "/change-password",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(authValidations.changePasswordValidationSchema),
  authControllers.changePassword
);

export const authRoutes = router;
