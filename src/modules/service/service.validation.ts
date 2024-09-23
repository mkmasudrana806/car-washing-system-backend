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
      .nonnegative("price must not be negative"),
    duration: z
      .number({
        required_error: "duration is required",
        invalid_type_error: "duration must in integer nonnegative number",
      })
      .nonnegative("duration must not be negative"),
    featured: z.boolean({ invalid_type_error: "featured must be boolean" }),
    serviceImgUrl: z
      .string({ invalid_type_error: "Service image url must be string" })
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
      .nonnegative("price must not be negative")
      .optional(),
    duration: z
      .number({
        required_error: "duration is required",
        invalid_type_error: "duration must in in integer nonnegative number",
      })
      .nonnegative("duration must not be negative")
      .optional(),
  }),
});

export const ServiceValidations = {
  createServiceValidationSchema,
  updateServiceValidationSchema,
};
