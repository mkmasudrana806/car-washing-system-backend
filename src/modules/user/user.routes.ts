import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";

import { UserValidations } from "./user.validation";
import auth from "../../middlewares/auth";

import httpStatus from "http-status";
import AppError from "../../utils/appError";
import validateRequest from "../../middlewares/validateRequestData";
import { upload } from "../../utils/upload";
const router = express.Router();

// create an user
router.post(
  "/create-user",
  upload.single("file"), // file uploading
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body?.data) {
      req.body = JSON.parse(req.body?.data);
      next();
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Please provide user data");
    }
  },
  validateRequest(UserValidations.createUserValidationsSchema),
  UserControllers.createAnUser
);

// get all users
router.get("/", auth("admin"), UserControllers.getAllUsers);

// get me route
router.get("/getMe", auth("user", "admin"), UserControllers.getMe);

// delete an user
router.delete("/:id", auth("admin"), UserControllers.deleteUser);

// update an user
router.patch(
  "/:id",
  auth("user", "admin"),
  validateRequest(UserValidations.updateUserValidationsSchema),
  UserControllers.updateUser
);

// change user status
router.patch(
  "/toggle-user-status/:id",
  auth("admin"),
  validateRequest(UserValidations.changeUserStatusSchema),
  UserControllers.changeUserStatus
);

// change user role
router.patch(
  "/toggle-user-role/:id",
  auth("admin"),
  validateRequest(UserValidations.changeUserRoleSchema),
  UserControllers.changeUserRole
);

export const UserRoutes = router;
