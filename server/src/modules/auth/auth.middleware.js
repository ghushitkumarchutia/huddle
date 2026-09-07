import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import ApiError from "../../common/utils/apiError.js";

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication token missing or invalid"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired authentication token"));
  }
};

export default requireAuth;
