const { z } = require("zod");

const registerUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
});

const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z.string().min(6, "New password must be at least 6 characters long"),
});

const updateUserProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long").optional(),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters long"),
});

const updateUserRoleSchema = z.object({
  role: z.enum(["User", "Admin", "Manager"], "Invalid user role"),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserProfileSchema,
  changePasswordSchema,
  updateUserRoleSchema,
};

