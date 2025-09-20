const asyncHandler = require("express-async-handler");
const { successResponse, errorResponse } = require("../utils/response");
const userService = require("../services/user.service");
const { updateUserProfileSchema, changePasswordSchema } = require("../dto/user.dto");

// @desc    Get logged-in user profile
// @route   GET /api/users/me
// @access  Private
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.getMyProfile(req.user._id);
  successResponse(res, "User profile fetched successfully", user);
});

// @desc    Update logged-in user profile
// @route   PATCH /api/users/me
// @access  Private
const updateMyProfile = asyncHandler(async (req, res) => {
  const { error } = updateUserProfileSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const user = await userService.updateMyProfile(req.user._id, req.body);
  successResponse(res, "User profile updated successfully", user);
});

// @desc    Soft delete logged-in user profile
// @route   DELETE /api/users/me
// @access  Private (User only)
const softDeleteMyProfile = asyncHandler(async (req, res) => {
  const result = await userService.softDeleteMyProfile(req.user._id);
  successResponse(res, result.message);
});

// @desc    Change logged-in user password
// @route   PATCH /api/users/me/change-password
// @access  Private
const changeMyPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const { error } = changePasswordSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const result = await userService.changeMyPassword(req.user._id, oldPassword, newPassword);
  successResponse(res, result.message);
});

// @desc    Upload/change profile picture (Multer)
// @route   POST /api/users/me/avatar
// @access  Private
const uploadMyAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, "No file uploaded", 400);
  }
  // In a real application, you would save the file path to the user model
  // and potentially upload to a cloud storage like S3.
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  // Update user model with avatarUrl
  // await User.findByIdAndUpdate(req.user._id, { avatar: avatarUrl });
  successResponse(res, "Avatar uploaded successfully", { avatarUrl });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  softDeleteMyProfile,
  changeMyPassword,
  uploadMyAvatar,
};

