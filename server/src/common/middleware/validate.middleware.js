import ApiError from "../utils/apiError.js";

const validate = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      next();
    } catch (error) {
      next(
        new ApiError(400, "Validation failed", error.errors || error.message),
      );
    }
  };
};

export default validate;
