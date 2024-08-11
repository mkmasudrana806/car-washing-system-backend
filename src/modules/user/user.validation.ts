import z from "zod";

// create user validation schema
const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "name is required" }),
    email: z
      .string({ required_error: "email is required" })
      .email("Please enter a valid email address"),
    password: z.string({ required_error: "password is required" }),
    phone: z.string({ required_error: "phone is required" }),
    address: z.string({ required_error: "address is required" }),
  }),
});

// update user validation schema
const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "name is required" }).optional(),
    phone: z.string({ required_error: "phone is required" }).optional(),
    address: z.string({ required_error: "address is required" }).optional(),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
