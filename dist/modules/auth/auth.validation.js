"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidations = void 0;
const zod_1 = require("zod");
// login validation schema
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: "email is required" }),
        password: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
// change password validation schema
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({ required_error: "Old password is required" }),
        newPassword: zod_1.z.string({ required_error: "Password is required" }),
    }),
});
exports.authValidations = {
    loginValidationSchema,
    changePasswordValidationSchema,
};
