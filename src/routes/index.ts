import { Router } from "express";

import { serviceRoutes } from "../modules/service/service.routes";
import { slotRoutes } from "../modules/slot/slot.routes";
import {
  bookingRoutes,
  userBookingRoutes,
} from "../modules/booking/booking.routes";
import { ReviewRoutes } from "../modules/reviews/review.routes";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.rotues";

const router = Router();
// users routes
router.use("/users", UserRoutes);

// auth routes
router.use("/auth", AuthRoutes);

// service routes
router.use("/services", serviceRoutes);

// slots routes
router.use("/slots", slotRoutes);

// bookings routes
router.use("/bookings", bookingRoutes);

// users bookings routes
router.use("/my-bookings", userBookingRoutes);

// user reviews
router.use("/reviews", ReviewRoutes);

export default router;
