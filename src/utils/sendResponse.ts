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
  // check if data exists
  let hasData: boolean = true;
  if (
    (Array.isArray(data.data) && data.data.length === 0) ||
    JSON.stringify(data.data) == "{}" ||
    data.data === null ||
    data.data == undefined
  ) {
    hasData = false;
  }

  // send response based on 'hasData' status flag
  res.status(data?.statusCode).json({
    success: hasData ? data.success : false,
    statusCode: hasData ? data.statusCode : httpStatus.NOT_FOUND,
    message: hasData ? data.message : "Data not found",
    token: data?.token,
    meta: data?.meta,
    data: data.data,
  });
};

export default sendResponse;
