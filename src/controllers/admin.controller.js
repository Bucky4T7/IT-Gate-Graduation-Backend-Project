const asyncHandler = require("express-async-handler");
const { successResponse, errorResponse } = require("../utils/response");
const adminService = require("../services/admin.service");
const { updateUserProfileSchema, updateUserRoleSchema } = require("../dto/user.dto");

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private/Admin/Manager
const getAllUsers = asyncHandler(async (req, res) => {
  const filters = {
    search: req.query.search,
    role: req.query.role,
    isBlocked: req.query.isBlocked,
    isDeleted: req.query.isDeleted,
  };
  const pagination = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
  };

  const { users, totalPages, currentPage } = await adminService.getAllUsers(filters, pagination);
  successResponse(res, "Users fetched successfully", { users, totalPages, currentPage });
});

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin/Manager
const getUserById = asyncHandler(async (req, res) => {
  const user = await adminService.getUserById(req.params.id);
  successResponse(res, "User fetched successfully", user);
});

// @desc    Block user
// @route   PATCH /api/admin/users/:id/block
// @access  Private/Admin/Manager
const blockUser = asyncHandler(async (req, res) => {
  const result = await adminService.blockUser(req.params.id);
  successResponse(res, result.message);
});

// @desc    Unblock user
// @route   PATCH /api/admin/users/:id/unblock
// @access  Private/Admin/Manager
const unblockUser = asyncHandler(async (req, res) => {
  const result = await adminService.unblockUser(req.params.id);
  successResponse(res, result.message);
});

// @desc    Change user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin/Manager
const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const { error } = updateUserRoleSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const result = await adminService.changeUserRole(req.params.id, role);
  successResponse(res, result.message);
});

// @desc    Delete user (soft delete)
// @route   DELETE /api/admin/users/:id/delete
// @access  Private/Admin/Manager
const deleteUser = asyncHandler(async (req, res) => {
  const result = await adminService.deleteUser(req.params.id);
  successResponse(res, result.message);
});

// @desc    Update admin's own profile
// @route   PATCH /api/admin/profile
// @access  Private/Admin/Manager
const updateAdminProfile = asyncHandler(async (req, res) => {
  const { error } = updateUserProfileSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const admin = await adminService.updateAdminProfile(req.user._id, req.body);
  successResponse(res, "Admin profile updated successfully", admin);
});

module.exports = {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  changeUserRole,
  deleteUser,
  updateAdminProfile,
};

