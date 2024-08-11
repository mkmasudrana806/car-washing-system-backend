import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { TErrorMessages } from "../interface/error";
import config from "../app/config";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateKeyError from "../errors/handleDuplicateKeyError";
import AppError from "../utils/appError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // setting default values
  let statusCode = 500;
  let message = "Something went wrong!";

  let errorMessages: TErrorMessages = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  //   error check and override
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateKeyError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } // AppError  handle
  else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorMessages = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessages = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.node_env === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
