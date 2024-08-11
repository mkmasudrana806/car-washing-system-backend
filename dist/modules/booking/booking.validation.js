"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidations = void 0;
const zod_1 = __importDefault(require("zod"));
const booking_constant_1 = require("./booking.constant");
// create Booking validation schema
const createBookingValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        service: zod_1.default.string({ required_error: "Service is required" }),
        slot: zod_1.default.string({ required_error: "Slot is required" }),
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
    }),
});
// update Booking validation schema
const updateBookingValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        slot: zod_1.default.string({ required_error: "Slot is required" }).optional(),
        vehicleType: zod_1.default
            .enum([...booking_constant_1.VEHICLE_TYPE])
            .optional(),
        vehicleBrand: zod_1.default
            .string({ required_error: "Vehicle Brand is required" })
            .optional(),
        vehicleModel: zod_1.default
            .string({
            required_error: "Vehicle model is required",
        })
            .optional(),
        manufacturingYear: zod_1.default
            .string({
            required_error: "Manufacturing year is required",
        })
            .optional(),
        registrationPlate: zod_1.default
            .number({
            required_error: "Registration plate number is required",
        })
            .optional(),
    }),
});
exports.BookingValidations = {
    createBookingValidationSchema,
    updateBookingValidationSchema,
};
