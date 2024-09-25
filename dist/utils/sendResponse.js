"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param res res object
 * @param data data. it can be array, null, empty object or anything
 */
const sendResponse = (res, data) => {
    // send response based on 'hasData' status flag
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        token: data === null || data === void 0 ? void 0 : data.token,
        meta: data === null || data === void 0 ? void 0 : data.meta,
        data: data.data,
    });
};
exports.default = sendResponse;
