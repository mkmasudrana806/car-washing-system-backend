import z from "zod";

// create service validation schema
const createServiceValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "name is required" }),
    description: z.string({ required_error: "description is required" }),
    price: z
      .number({
        required_error: "price is required",
        invalid_type_error: "price must in integer nonnegative number",
      })
      .nonnegative(),
    duration: z
      .number({
        required_error: "duration is required",
        invalid_type_error: "duration must in integer nonnegative number",
      })
      .nonnegative(),
  }),
});

// update service validation schema
const updateServiceValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "name is required" }).optional(),
    description: z
      .string({ required_error: "description is required" })
      .optional(),
    price: z
      .number({
        required_error: "price is required",
        invalid_type_error: "price must in in integer nonnegative number",
      })
      .nonnegative()
      .optional(),
    duration: z
      .number({
        required_error: "duration is required",
        invalid_type_error: "duration must in in integer nonnegative number",
      })
      .nonnegative()
      .optional(),
  }),
});

export const ServiceValidations = {
  createServiceValidationSchema,
  updateServiceValidationSchema,
};
