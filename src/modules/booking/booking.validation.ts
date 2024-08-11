import z from "zod";
import { VEHICLE_TYPE } from "./booking.constant";

// create Booking validation schema
const createBookingValidationSchema = z.object({
  body: z.object({
    service: z.string({ required_error: "Service is required" }),
    slot: z.string({ required_error: "Slot is required" }),
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
  }),
});

// update Booking validation schema
const updateBookingValidationSchema = z.object({
  body: z.object({
    slot: z.string({ required_error: "Slot is required" }).optional(),
    vehicleType: z
      .enum([...(VEHICLE_TYPE as [string, ...string[]])])
      .optional(),
    vehicleBrand: z
      .string({ required_error: "Vehicle Brand is required" })
      .optional(),
    vehicleModel: z
      .string({
        required_error: "Vehicle model is required",
      })
      .optional(),
    manufacturingYear: z
      .string({
        required_error: "Manufacturing year is required",
      })
      .optional(),
    registrationPlate: z
      .number({
        required_error: "Registration plate number is required",
      })
      .optional(),
  }),
});

export const BookingValidations = {
  createBookingValidationSchema,
  updateBookingValidationSchema,
};
