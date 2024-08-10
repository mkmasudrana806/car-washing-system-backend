import { z } from "zod";

// login validation schema
const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "email is required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

// change password validation schema
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old password is required" }),
    newPassword: z.string({ required_error: "Password is required" }),
  }),
});

export const authValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
};
