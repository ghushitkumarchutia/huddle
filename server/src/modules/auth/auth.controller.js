import authServices from "./auth.services.js";
import asyncHandler from "../../common/utils/asyncHandler.js";
import ApiResponse from "../../common/utils/apiResponse.js";
import { jwtRefreshExpiry } from "../../common/config/env.config.js";

const parseExpiry = (expiryStr) => {
  const value = parseInt(expiryStr);
  if (expiryStr.endsWith("d")) return value * 24 * 60 * 60 * 1000;
  if (expiryStr.endsWith("h")) return value * 60 * 60 * 1000;
  if (expiryStr.endsWith("m")) return value * 60 * 1000;
  return 7 * 24 * 60 * 60 * 1000;
};

const setRefreshTokenCookie = (res, token) => {
  const maxAge = parseExpiry(jwtRefreshExpiry);
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge,
  });
};

const clearRefreshTokenCookie = (res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });
};

const signup = asyncHandler(async (req, res) => {
  const { username, email, password, displayName } = req.body;
  const user = await authServices.signup(
    username,
    email,
    password,
    displayName,
  );
  const userObject = user.toObject();
  delete userObject.passwordHash;
  res
    .status(201)
    .json(new ApiResponse(201, userObject, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authServices.login(
    email,
    password,
  );

  setRefreshTokenCookie(res, refreshToken);

  const userObject = user.toObject();
  delete userObject.passwordHash;

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: userObject, accessToken },
        "Login successful",
      ),
    );
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  await authServices.logout(refreshToken);
  clearRefreshTokenCookie(res);
  res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

const refresh = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies?.refreshToken;
  const { accessToken, refreshToken } =
    await authServices.refreshAccessToken(oldRefreshToken);

  setRefreshTokenCookie(res, refreshToken);

  res
    .status(200)
    .json(
      new ApiResponse(200, { accessToken }, "Token refreshed successfully"),
    );
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authServices.forgotPassword(email);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "If that email is registered, a password reset link has been sent.",
      ),
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  await authServices.resetPassword(token, newPassword);
  res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});

export default {
  signup,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
};
