import { Response } from "express";
import httpStatus from "http-status";

type TResponse<T, U> = {
  success: boolean;
  statusCode: number;
  message?: string;
  token?: string;
  meta?: U;
  data: T;
};

/**
 *
 * @param res res object
 * @param data data. it can be array, null, empty object or anything
 */
const sendResponse = <T, U>(res: Response, data: TResponse<T, U>) => {
  // send response based on 'hasData' status flag
  res.status(data?.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    token: data?.token,
    meta: data?.meta,
    data: data.data,
  });
};

export default sendResponse;
