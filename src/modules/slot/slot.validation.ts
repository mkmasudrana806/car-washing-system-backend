import z from "zod";

// HH:MM time format validation
const timeFormatValidation = z
  .string({ required_error: "Time is required" })
  .refine(
    (time) => {
      const result = /^([01]\d|2[0-3]):([0-5]\d)$/;
      return result.test(time);
    },
    {
      message: "time format must be HH:MM 24 hr format",
    }
  );

// create slot validation schema
const createSlotValidationSchema = z.object({
  body: z
    .object({
      service: z.string({ required_error: "service is required" }),
      date: z.string({ required_error: "date is required" }),
      startTime: timeFormatValidation,
      endTime: timeFormatValidation,
    })
    .refine(
      (body) => {
        // verify that start time is less than end time
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);
        return end > start;
      },
      {
        message: "end time must be greater than start time",
      }
    ),
});

// update slot validation schema
const updateSlotValidationSchema = z.object({
  body: z
    .object({
      service: z.string({ required_error: "service is required" }).optional(),
      date: z.string({ required_error: "date is required" }).optional(),
      startTime: timeFormatValidation.optional(),
      endTime: timeFormatValidation.optional(),
      isBooked: z.enum(["available", "booked", "cancelled"]).optional(),
    })
    .refine(
      (body) => {
        if (body.startTime && body.endTime) {
          // verify that start time is less than end time
          const start = new Date(`1970-01-01T${body.startTime}:00`);
          const end = new Date(`1970-01-01T${body.endTime}:00`);
          return end > start;
        }
        return true;
      },
      {
        message: "end time must be greater than start time",
      }
    )
    .optional(),
});

export const SlotValidations = {
  createSlotValidationSchema,
  updateSlotValidationSchema,
};
