// handle all user routes
import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequestData";
import { UserValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.constant";

const router = express.Router();

// get all users
router.get(
  "/",
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.getAllUsers
);

// get single user
router.get(
  "/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.getSingleUser
);

// delete an user
router.delete("/:id", auth(USER_ROLE.admin), UserControllers.deleteUser);

// update an user
router.patch(
  "/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateUser
);

// export routes
export const userRoutes = router;
