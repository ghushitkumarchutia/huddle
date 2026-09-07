import User from "./auth.model.js";
import PasswordResetToken from "./passwordResetToken.model.js";
import RefreshToken from "../../models/refreshToken.model.js";
import {
  hashPassword,
  comparePassword,
  hashToken,
} from "../../common/utils/hash.utils.js";
import { generateSecureToken } from "../../common/utils/token.utils.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
import { sendPasswordResetEmail } from "../../common/utils/email.utils.js";
import ApiError from "../../common/utils/apiError.js";
import { jwtRefreshExpiry } from "../../common/config/env.config.js";

const parseExpiry = (expiryStr) => {
  const value = parseInt(expiryStr);
  if (expiryStr.endsWith("d")) return value * 24 * 60 * 60 * 1000;
  if (expiryStr.endsWith("h")) return value * 60 * 60 * 1000;
  if (expiryStr.endsWith("m")) return value * 60 * 1000;
  return 7 * 24 * 60 * 60 * 1000;
};

const signup = async (username, email, password, displayName) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    username,
    email,
    passwordHash,
    displayName,
  });

  return user;
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = signAccessToken({ id: user._id });
  const rawRefreshToken = signRefreshToken({ id: user._id });
  const hashedRefreshToken = hashToken(rawRefreshToken);

  const expiryMs = parseExpiry(jwtRefreshExpiry);

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashedRefreshToken,
    expiresAt: new Date(Date.now() + expiryMs),
  });

  return { user, accessToken, refreshToken: rawRefreshToken };
};

const logout = async (refreshTokenRaw) => {
  if (refreshTokenRaw) {
    const hashedRefreshToken = hashToken(refreshTokenRaw);
    await RefreshToken.findOneAndDelete({ tokenHash: hashedRefreshToken });
  }
};

const refreshAccessToken = async (refreshTokenRaw) => {
  if (!refreshTokenRaw) {
    throw new ApiError(401, "Refresh token required");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshTokenRaw);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const hashedRefreshToken = hashToken(refreshTokenRaw);
  const tokenRecord = await RefreshToken.findOneAndDelete({
    user: decoded.id,
    tokenHash: hashedRefreshToken,
  });

  if (!tokenRecord) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const accessToken = signAccessToken({ id: decoded.id });
  const newRawRefreshToken = signRefreshToken({ id: decoded.id });
  const newHashedRefreshToken = hashToken(newRawRefreshToken);

  const expiryMs = parseExpiry(jwtRefreshExpiry);

  await RefreshToken.create({
    user: decoded.id,
    tokenHash: newHashedRefreshToken,
    expiresAt: new Date(Date.now() + expiryMs),
  });

  return { accessToken, refreshToken: newRawRefreshToken };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return;
  }

  const rawToken = generateSecureToken();
  const hashedToken = hashToken(rawToken);

  await PasswordResetToken.create({
    user: user._id,
    tokenHash: hashedToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  await sendPasswordResetEmail(email, rawToken);
};

const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = hashToken(rawToken);
  const resetRecord = await PasswordResetToken.findOne({
    tokenHash: hashedToken,
  });

  if (!resetRecord || resetRecord.expiresAt < new Date()) {
    throw new ApiError(400, "Invalid or expired password reset token");
  }

  const user = await User.findById(resetRecord.user);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  await PasswordResetToken.deleteMany({ user: user._id });
  await RefreshToken.deleteMany({ user: user._id });
};

export default {
  signup,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
};
