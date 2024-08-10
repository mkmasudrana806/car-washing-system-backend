"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = __importDefault(require("zod"));
// create user validation schema
const createUserValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string({ required_error: "name is required" }),
        email: zod_1.default
            .string({ required_error: "email is required" })
            .email("Please enter a valid email address"),
        password: zod_1.default.string().optional(),
        phone: zod_1.default.string({ required_error: "phone is required" }),
        address: zod_1.default.string({ required_error: "address is required" }),
    }),
});
// update user validation schema
const updateUserValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string({ required_error: "name is required" }),
        email: zod_1.default
            .string({ required_error: "email is required" })
            .email("Please enter a valid email address")
            .optional(),
        password: zod_1.default.string().optional(),
        phone: zod_1.default.string({ required_error: "phone is required" }).optional(),
        address: zod_1.default.string({ required_error: "address is required" }).optional(),
    }),
});
exports.UserValidations = {
    createUserValidationSchema,
    updateUserValidationSchema,
};
