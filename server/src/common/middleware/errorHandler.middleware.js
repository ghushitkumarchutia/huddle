import ApiError from "../utils/apiError.js";
import logger from "../utils/logger.utils.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error.details || null);

    if (statusCode === 500) {
      logger.error(err.message || "Unexpected Error", err.stack);
    }
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
  };

  if (error.details) {
    response.details = error.details;
  }

  if (process.env.NODE_ENV !== "production" && err.stack) {
    response.stack = err.stack;
  }

  res.status(error.statusCode).json(response);
};

export default errorHandler;
