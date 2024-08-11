import { Router } from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoutes } from "../modules/auth/auth.route";
import { serviceRoutes } from "../modules/service/service.routes";
import { slotRoutes } from "../modules/slot/slot.routes";
import {
  bookingRoutes,
  userBookingRoutes,
} from "../modules/booking/booking.routes";

const router = Router();
// users routes
router.use("/users", userRoutes);

// auth routes
router.use("/auth", authRoutes);

// service routes
router.use("/services", serviceRoutes);

// slots routes
router.use("/slots", slotRoutes);

// bookings routes
router.use("/bookings", bookingRoutes);

// users bookings routes
router.use("/my-bookings", userBookingRoutes);

export default router;
