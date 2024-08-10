// handle all user routes
import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";

import validateRequest from "../../middlewares/validateRequestData";
import { UserValidations } from "./user.validation";

const router = express.Router();

// get all users
router.get("/", UserControllers.getAllUsers);

// get single user
router.get("/:id", UserControllers.getSingleUser);

// delete an user
router.delete("/:id", UserControllers.deleteUser);

// update an user
router.patch(
  "/:id",
  validateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateUser
);

// export routes
export const userRoutes = router;
