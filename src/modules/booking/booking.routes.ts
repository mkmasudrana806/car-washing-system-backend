// handle all Booking routes
import express, { NextFunction, Request, Response } from "express";
import { BookingControllers } from "./booking.controller";

import validateRequest from "../../middlewares/validateRequestData";
import { BookingValidations } from "./booking.validation";
import auth from "../../middlewares/auth";
import { SlotValidations } from "../slot/slot.validation";
import { SlotControllers } from "../slot/slot.controller";
import { USER_ROLE } from "../auth/auth.constant";

const router = express.Router();
const userRouter = express.Router();

// create a Booking
router.post(
  "/create-booking",
  auth(USER_ROLE.user),
  validateRequest(BookingValidations.createBookingValidationSchema),
  BookingControllers.createBooking
);

// get all Bookings
router.get("/", auth(USER_ROLE.admin), BookingControllers.getAllBookings);

// get single Booking
router.get(
  "/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  BookingControllers.getSingleBooking
);

// get user's bookings
userRouter.get("/", auth(USER_ROLE.user), BookingControllers.getUserBookings);

// delete an Booking
router.delete(
  "/:id",
  auth(USER_ROLE.user, USER_ROLE.admin),
  BookingControllers.deleteBooking
);

// update an Booking
router.put(
  "/:id",
  auth(USER_ROLE.admin),
  validateRequest(BookingValidations.updateBookingValidationSchema),
  BookingControllers.updateBooking
);

router.post(
  "/slots",
  auth(USER_ROLE.admin),
  validateRequest(SlotValidations.createSlotValidationSchema),
  SlotControllers.createSlot
);

// export routes
export const bookingRoutes = router;
export const userBookingRoutes = userRouter;
