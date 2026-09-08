import ApiError from "../utils/apiError.js";
import logger from "../utils/logger.utils.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (error.name === "CastError") {
    error = new ApiError(400, `Invalid ${error.path}: ${error.value}`);
  } else if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e) => e.message);
    error = new ApiError(400, "Validation failed", messages);
  } else if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {}).join(", ");
    error = new ApiError(409, `Duplicate value for: ${field}`);
  } else if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    if (statusCode === 500) {
      logger.error(err.message || "Unexpected Error", err.stack);
    }
    error = new ApiError(statusCode, message, error.details || null);
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
