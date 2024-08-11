"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (err) => {
    const statusCode = 401;
    const errorMessages = Object.values(err.errors).map((val) => {
        return {
            path: val === null || val === void 0 ? void 0 : val.path,
            message: val === null || val === void 0 ? void 0 : val.message,
        };
    });
    return {
        statusCode,
        message: "mongoose validation error",
        errorMessages,
    };
};
exports.default = handleValidationError;
