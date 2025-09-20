const User = require("../models/user.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { generateOTP } = require("../utils/otp");
const { client: redisClient } = require("../config/redis");
const transporter = require("../config/mailer");
const logger = require("../utils/logger");

const registerUser = async (userData) => {
  const { email, password, name, phone } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const otp = generateOTP();
  // Store user data and OTP in Redis with expiry
  await redisClient.set(`register_otp:${email}`, JSON.stringify({ ...userData, otp }), { EX: 900 }); // 15 minutes expiry

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Verify Your Email - OTP for E-commerce",
    html: `<p>Your OTP for email verification is: <strong>${otp}</strong></p><p>This OTP is valid for 15 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);

  return { message: "OTP sent to email for verification" };
};

const verifyOtp = async (email, otp) => {
  const storedData = await redisClient.get(`register_otp:${email}`);

  if (!storedData) {
    throw new Error("OTP expired or invalid");
  }

  const { password, name, phone, otp: storedOtp } = JSON.parse(storedData);

  if (otp !== storedOtp) {
    throw new Error("Invalid OTP");
  }

  const user = await User.create({ email, password, name, phone, isConfirmEmail: true });

  await redisClient.del(`register_otp:${email}`); // Clear OTP from Redis

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

  return { user, accessToken, refreshToken };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid credentials");
  }

  if (!user.isConfirmEmail) {
    throw new Error("Email not verified. Please verify your email.");
  }

  if (user.isBlocked) {
    throw new Error("Your account has been blocked.");
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

  return { user, accessToken, refreshToken };
};

const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    throw new Error("Invalid refresh token");
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new Error("User not found");
  }

  const newAccessToken = generateAccessToken({ id: user._id, role: user.role });
  return { accessToken: newAccessToken };
};

const logoutUser = async (refreshToken) => {
  // In a real application, you might blacklist the refresh token or remove it from a database/Redis
  // For this implementation, we'll just acknowledge the logout.
  logger.info("User logged out. Refresh token should be invalidated on client side.");
  return { message: "Logged out successfully" };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOTP();
  await redisClient.set(`reset_otp:${email}`, otp, { EX: 600 }); // 10 minutes expiry

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Password Reset OTP for E-commerce",
    html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);

  return { message: "Password reset OTP sent to email" };
};

const resetPassword = async (email, otp, newPassword) => {
  const storedOtp = await redisClient.get(`reset_otp:${email}`);

  if (!storedOtp || otp !== storedOtp) {
    throw new Error("Invalid or expired OTP");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  user.password = newPassword; // Mongoose pre-save hook will hash it
  await user.save();

  await redisClient.del(`reset_otp:${email}`);

  return { message: "Password reset successfully" };
};

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
};

