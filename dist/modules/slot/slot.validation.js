"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotValidations = void 0;
const zod_1 = __importDefault(require("zod"));
const booking_constant_1 = require("../booking/booking.constant");
// HH:MM time format validation
const timeFormatValidation = zod_1.default
    .string({ required_error: "Time is required" })
    .refine((time) => {
    const result = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return result.test(time);
}, {
    message: "time format must be HH:MM 24 hr format and less than 24:00",
});
// create slot validation schema
const createSlotValidationSchema = zod_1.default.object({
    body: zod_1.default
        .object({
        service: zod_1.default.string({ required_error: "service is required" }),
        date: zod_1.default.string({ required_error: "date is required" }),
        startTime: timeFormatValidation,
        endTime: timeFormatValidation,
    })
        .refine((body) => {
        // verify that start time is less than end time
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);
        return end > start;
    }, {
        message: "end time must be greater than start time",
    }),
});
// update slot validation schema
const updateSlotValidationSchema = zod_1.default.object({
    body: zod_1.default
        .object({
        service: zod_1.default.string({ required_error: "service is required" }).optional(),
        date: zod_1.default.string({ required_error: "date is required" }).optional(),
        startTime: timeFormatValidation.optional(),
        endTime: timeFormatValidation.optional(),
        isBooked: zod_1.default
            .enum([
            booking_constant_1.BOOKING_TYPE.available,
            booking_constant_1.BOOKING_TYPE.booked,
            booking_constant_1.BOOKING_TYPE.cancelled,
        ])
            .optional(),
    })
        .refine((body) => {
        if (body.startTime && body.endTime) {
            // verify that start time is less than end time
            const start = new Date(`1970-01-01T${body.startTime}:00`);
            const end = new Date(`1970-01-01T${body.endTime}:00`);
            return end > start;
        }
        return true;
    }, {
        message: "end time must be greater than start time",
    })
        .optional(),
});
exports.SlotValidations = {
    createSlotValidationSchema,
    updateSlotValidationSchema,
};
