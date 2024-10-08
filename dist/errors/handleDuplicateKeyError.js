"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateKeyError = (err) => {
    // extract value within double quotes using regex
    const match = err.message.match(/"([^"]*)"/);
    // extracted value will be in the first capturing group
    const extracted_message = match && match[1];
    const errorMessages = [
        {
            path: "",
            message: `${extracted_message} is already exists`,
        },
    ];
    const statusCode = 400;
    return {
        message: "duplicate key error",
        statusCode,
        errorMessages,
    };
};
exports.default = handleDuplicateKeyError;
