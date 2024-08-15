"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    /**
     * @param statusCode status code for this error
     * @param message message for this error
     * @param stack stack trace for this error if any ( optional )
     */
    constructor(statusCode, message, stack = "") {
        super(message);
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = AppError;
