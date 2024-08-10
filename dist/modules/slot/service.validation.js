"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slotValidations = void 0;
const zod_1 = __importDefault(require("zod"));
// create slot validation schema
const createslotValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string({ required_error: "name is required" }),
        description: zod_1.default.string({ required_error: "description is required" }),
        price: zod_1.default
            .number({
            required_error: "price is required",
            invalid_type_error: "price must in integer nonnegative number",
        })
            .nonnegative(),
        duration: zod_1.default
            .number({
            required_error: "duration is required",
            invalid_type_error: "duration must in integer nonnegative number",
        })
            .nonnegative(),
    }),
});
// update slot validation schema
const updateslotValidationSchema = zod_1.default.object({
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
            .nonnegative()
            .optional(),
        duration: zod_1.default
            .number({
            required_error: "duration is required",
            invalid_type_error: "duration must in in integer nonnegative number",
        })
            .nonnegative()
            .optional(),
    }),
});
exports.slotValidations = {
    createslotValidationSchema,
    updateslotValidationSchema,
};
