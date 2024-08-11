import mongoose from "mongoose";
import { TErrorMessages, TGenericErrorResponse } from "../interface/error";

const handleCastError = (
  err: mongoose.Error.CastError
): TGenericErrorResponse => {
  const statusCode = 401;
  const errorMessages: TErrorMessages = [
    { path: err?.path, message: err?.message },
  ];

  return {
    statusCode,
    message: "Invalid ID",
    errorMessages,
  };
};

export default handleCastError;
