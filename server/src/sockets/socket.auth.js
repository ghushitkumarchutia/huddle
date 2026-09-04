const { verifyAccessToken } = require("../common/utils/jwt.utils");
const ApiError = require("../common/utils/apiError");

const socketAuthMiddleware = (socket, next) => {
  const tokenPayload = socket.handshake.auth?.token;

  if (!tokenPayload || !tokenPayload.startsWith("Bearer ")) {
    return next(new ApiError(401, "Authentication token missing or invalid"));
  }

  const token = tokenPayload.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    socket.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired authentication token"));
  }
};

module.exports = socketAuthMiddleware;
