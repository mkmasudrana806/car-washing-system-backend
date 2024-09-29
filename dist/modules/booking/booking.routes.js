"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userBookingRoutes = exports.bookingRoutes = void 0;
// handle all Booking routes
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("./booking.controller");
const validateRequestData_1 = __importDefault(require("../../middlewares/validateRequestData"));
const booking_validation_1 = require("./booking.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const slot_validation_1 = require("../slot/slot.validation");
const slot_controller_1 = require("../slot/slot.controller");
const auth_constant_1 = require("../auth/auth.constant");
const router = express_1.default.Router();
const userRouter = express_1.default.Router();
// create a Booking
router.post("/create-booking", (0, auth_1.default)(auth_constant_1.USER_ROLE.user), (0, validateRequestData_1.default)(booking_validation_1.BookingValidations.createBookingValidationSchema), booking_controller_1.BookingControllers.createBooking);
// get all Bookings
router.get("/", (0, auth_1.default)("admin"), booking_controller_1.BookingControllers.getAllBookings);
// get single Booking
router.get("/:id", (0, auth_1.default)(auth_constant_1.USER_ROLE.user, auth_constant_1.USER_ROLE.admin), booking_controller_1.BookingControllers.getSingleBooking);
// get user's bookings
userRouter.get("/", (0, auth_1.default)(auth_constant_1.USER_ROLE.user), booking_controller_1.BookingControllers.getUserBookings);
// delete an Booking
router.delete("/:id", (0, auth_1.default)(auth_constant_1.USER_ROLE.user, auth_constant_1.USER_ROLE.admin), booking_controller_1.BookingControllers.deleteBooking);
// update an Booking
router.put("/:id", (0, auth_1.default)(auth_constant_1.USER_ROLE.admin), (0, validateRequestData_1.default)(booking_validation_1.BookingValidations.updateBookingValidationSchema), booking_controller_1.BookingControllers.updateBooking);
router.post("/slots", (0, auth_1.default)(auth_constant_1.USER_ROLE.admin), (0, validateRequestData_1.default)(slot_validation_1.SlotValidations.createSlotValidationSchema), slot_controller_1.SlotControllers.createSlot);
// export routes
exports.bookingRoutes = router;
exports.userBookingRoutes = userRouter;
