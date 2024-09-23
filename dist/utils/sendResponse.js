"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
/**
 *
 * @param res res object
 * @param data data. it can be array, null, empty object or anything
 */
const sendResponse = (res, data) => {
    // check if data exists
    let hasData = true;
    if ((Array.isArray(data.data) && data.data.length === 0) ||
        JSON.stringify(data.data) == "{}" ||
        data.data === null ||
        data.data == undefined) {
        hasData = false;
    }
    // send response based on 'hasData' status flag
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json({
        success: hasData ? data.success : false,
        statusCode: hasData ? data.statusCode : http_status_1.default.NOT_FOUND,
        message: hasData ? data.message : "Data not found",
        token: data === null || data === void 0 ? void 0 : data.token,
        meta: data === null || data === void 0 ? void 0 : data.meta,
        data: data.data,
    });
};
exports.default = sendResponse;
