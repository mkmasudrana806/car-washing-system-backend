"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * call this function with controller function
 * @param fn an async controller function
 * @returns return another function. that function return a promise.resolve(fn(req, res, next)).catch(err => next(err));
 */
const catchAsync = (fn) => {
    return (req, res, next) => Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
exports.default = catchAsync;
