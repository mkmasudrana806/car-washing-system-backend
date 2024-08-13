class AppError extends Error {
  public statusCode: number;

  /**
   * @param statusCode status code for this error
   * @param message message for this error
   * @param stack stack trace for this error if any ( optional )
   */
  constructor(statusCode: number, message: string, stack = "") {
    super(message);
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
