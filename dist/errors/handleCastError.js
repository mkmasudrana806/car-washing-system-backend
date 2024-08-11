"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const statusCode = 401;
    const errorMessages = [
        { path: err === null || err === void 0 ? void 0 : err.path, message: err === null || err === void 0 ? void 0 : err.message },
    ];
    return {
        statusCode,
        message: "Invalid ID",
        errorMessages,
    };
};
exports.default = handleCastError;
