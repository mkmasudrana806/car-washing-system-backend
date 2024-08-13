import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * call this function with controller function
 * @param fn an async controller function
 * @returns return another function. that function return a promise.resolve(fn(req, res, next)).catch(err => next(err));
 */
const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsync;
