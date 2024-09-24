"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const mongoose_1 = require("mongoose");
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const handleDuplicateKeyError_1 = __importDefault(require("../errors/handleDuplicateKeyError"));
const appError_1 = __importDefault(require("../utils/appError"));
const config_1 = __importDefault(require("../app/config"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = err.message || "INTERNAL SERVER ERROR";
    let errorMessages = [
        { path: "", message: "Someting went wrong!" },
    ];
    // handle zod validation errors
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // handle mongoose validation errors
    else if (err instanceof mongoose_1.Error.ValidationError) {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // handle mongodb cast errors
    else if (err instanceof mongoose_1.Error.CastError) {
        const simplifiedError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // handle duplicate key errors
    else if (err.code === 11000) {
        const simplifiedError = (0, handleDuplicateKeyError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    // handle AppError class errors
    else if (err instanceof appError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorMessages = [{ path: "", message: err === null || err === void 0 ? void 0 : err.message }];
    }
    // handle express Error errors
    else if (err instanceof mongoose_1.Error) {
        message = err.message;
        errorMessages = [{ path: "", message: err === null || err === void 0 ? void 0 : err.message }];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config_1.default.node_environment === "development" ? err.stack : "",
    });
};
exports.default = globalErrorHandler;
