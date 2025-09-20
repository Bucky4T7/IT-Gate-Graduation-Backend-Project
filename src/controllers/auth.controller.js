const asyncHandler = require("express-async-handler");
const { successResponse, errorResponse } = require("../utils/response");
const authService = require("../services/auth.service");
const { registerUserSchema, loginUserSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema } = require("../dto/user.dto");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { email, password, name, phone } = req.body;

  const { error } = registerUserSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const result = await authService.registerUser({ email, password, name, phone });
  successResponse(res, result.message, {}, 201);
});

// @desc    Verify OTP and activate account
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const { error } = verifyOtpSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const { user, accessToken, refreshToken } = await authService.verifyOtp(email, otp);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  successResponse(res, "Account verified and logged in", { user, accessToken });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginUserSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  successResponse(res, "Logged in successfully", { user, accessToken });
});

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return errorResponse(res, "Refresh token not found", 401);
  }

  const { accessToken } = await authService.refreshAccessToken(refreshToken);

  successResponse(res, "Access token refreshed", { accessToken });
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken");
  successResponse(res, "Logged out successfully");
});

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const { error } = forgotPasswordSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const result = await authService.forgotPassword(email);
  successResponse(res, result.message);
});

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const { error } = resetPasswordSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const result = await authService.resetPassword(email, otp, newPassword);
  successResponse(res, result.message);
});

module.exports = {
  register,
  verifyOtp,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};

