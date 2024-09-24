import z from "zod";
import { VEHICLE_TYPE } from "./booking.constant";
// booking info schema
const bookingInfoValidationSchema = z.object({
  vehicleType: z.enum([...(VEHICLE_TYPE as [string, ...string[]])]),
  vehicleBrand: z.string({ required_error: "Vehicle Brand is required" }),
  vehicleModel: z.string({
    required_error: "Vehicle model is required",
  }),
  manufacturingYear: z.number({
    required_error: "Manufacturing year is required",
  }),
  registrationPlate: z.string({
    required_error: "Registration plate number is required",
  }),
});

// create Booking validation schema
const createBookingValidationSchema = z.object({
  body: z.object({
    service: z.string({ required_error: "Service is required" }),
    slot: z.string({ required_error: "Slot is required" }),
    vehicleInfo: bookingInfoValidationSchema,
  }),
});

// update booking info schema
const updateBookingInfoSchema = bookingInfoValidationSchema.partial();

// update Booking validation schema
const updateBookingValidationSchema = z.object({
  body: z.object({
    slotId: z.string({ required_error: "Slot is required" }).optional(),
    vehicleInfo: bookingInfoValidationSchema.optional(),
  }),
});

export const BookingValidations = {
  createBookingValidationSchema,
  updateBookingValidationSchema,
};
