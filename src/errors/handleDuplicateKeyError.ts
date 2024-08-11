import { TErrorMessages, TGenericErrorResponse } from "../interface/error";

const handleDuplicateKeyError = (err: any): TGenericErrorResponse => {
  // extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // extracted value will be in the first capturing group
  const extracted_message = match && match[1];
  const errorMessages: TErrorMessages = [
    {
      path: "",
      message: `${extracted_message} is already exists`,
    },
  ];

  const statusCode = 401;
  return {
    message: "duplicate key error",
    statusCode,
    errorMessages,
  };
};

export default handleDuplicateKeyError;
