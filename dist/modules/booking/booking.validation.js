"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidations = void 0;
const zod_1 = __importDefault(require("zod"));
const booking_constant_1 = require("./booking.constant");
// booking info schema
const bookingInfoValidationSchema = zod_1.default.object({
    vehicleType: zod_1.default.enum([...booking_constant_1.VEHICLE_TYPE]),
    vehicleBrand: zod_1.default.string({ required_error: "Vehicle Brand is required" }),
    vehicleModel: zod_1.default.string({
        required_error: "Vehicle model is required",
    }),
    manufacturingYear: zod_1.default.number({
        required_error: "Manufacturing year is required",
    }),
    registrationPlate: zod_1.default.string({
        required_error: "Registration plate number is required",
    }),
});
// create Booking validation schema
const createBookingValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        service: zod_1.default.string({ required_error: "Service is required" }),
        slot: zod_1.default.string({ required_error: "Slot is required" }),
        vehicleInfo: bookingInfoValidationSchema,
        amount: zod_1.default.number({
            required_error: "Amount is required",
            invalid_type_error: "Amount should be number",
        }),
    }),
});
// update booking info schema
const updateBookingInfoSchema = bookingInfoValidationSchema.partial();
// update Booking validation schema
const updateBookingValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        slotId: zod_1.default.string({ required_error: "Slot is required" }).optional(),
        vehicleInfo: bookingInfoValidationSchema.optional(),
    }),
});
exports.BookingValidations = {
    createBookingValidationSchema,
    updateBookingValidationSchema,
};
