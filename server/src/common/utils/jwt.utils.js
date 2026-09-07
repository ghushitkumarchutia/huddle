import jwt from "jsonwebtoken";
import {
  jwtAccessSecret,
  jwtAccessExpiry,
  jwtRefreshSecret,
  jwtRefreshExpiry,
} from "../config/env.config.js";

const signAccessToken = (payload) => {
  return jwt.sign(payload, jwtAccessSecret, { expiresIn: jwtAccessExpiry });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, jwtAccessSecret);
};

const signRefreshToken = (payload) => {
  return jwt.sign(payload, jwtRefreshSecret, { expiresIn: jwtRefreshExpiry });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtRefreshSecret);
};

export {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
