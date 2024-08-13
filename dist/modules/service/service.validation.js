"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceValidations = void 0;
const zod_1 = __importDefault(require("zod"));
// create service validation schema
const createServiceValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string({ required_error: "name is required" }),
        description: zod_1.default.string({ required_error: "description is required" }),
        price: zod_1.default
            .number({
            required_error: "price is required",
            invalid_type_error: "price must in integer nonnegative number",
        })
            .nonnegative("price must not be negative"),
        duration: zod_1.default
            .number({
            required_error: "duration is required",
            invalid_type_error: "duration must in integer nonnegative number",
        })
            .nonnegative("duration must not be negative"),
    }),
});
// update service validation schema
const updateServiceValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string({ required_error: "name is required" }).optional(),
        description: zod_1.default
            .string({ required_error: "description is required" })
            .optional(),
        price: zod_1.default
            .number({
            required_error: "price is required",
            invalid_type_error: "price must in in integer nonnegative number",
        })
            .nonnegative("price must not be negative")
            .optional(),
        duration: zod_1.default
            .number({
            required_error: "duration is required",
            invalid_type_error: "duration must in in integer nonnegative number",
        })
            .nonnegative("duration must not be negative")
            .optional(),
    }),
});
exports.ServiceValidations = {
    createServiceValidationSchema,
    updateServiceValidationSchema,
};
