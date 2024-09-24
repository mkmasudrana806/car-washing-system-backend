"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_routes_1 = require("../modules/service/service.routes");
const slot_routes_1 = require("../modules/slot/slot.routes");
const booking_routes_1 = require("../modules/booking/booking.routes");
const review_routes_1 = require("../modules/reviews/review.routes");
const user_routes_1 = require("../modules/user/user.routes");
const auth_rotues_1 = require("../modules/auth/auth.rotues");
const router = (0, express_1.Router)();
// users routes
router.use("/users", user_routes_1.UserRoutes);
// auth routes
router.use("/auth", auth_rotues_1.AuthRoutes);
// service routes
router.use("/services", service_routes_1.serviceRoutes);
// slots routes
router.use("/slots", slot_routes_1.slotRoutes);
// bookings routes
router.use("/bookings", booking_routes_1.bookingRoutes);
// users bookings routes
router.use("/my-bookings", booking_routes_1.userBookingRoutes);
// user reviews
router.use("/reviews", review_routes_1.ReviewRoutes);
exports.default = router;
