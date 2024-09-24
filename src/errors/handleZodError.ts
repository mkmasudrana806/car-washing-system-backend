import { ZodError, ZodIssue } from "zod";
import { TErrorMessages, TGenericErrorResponse } from "../interface/error";

// handle zod error functions
const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const errorMessages: TErrorMessages = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  return {
    statusCode,
    message: "zod validation error",
    errorMessages,
  };
};

export default handleZodError;
