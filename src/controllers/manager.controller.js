const asyncHandler = require("express-async-handler");
const { successResponse, errorResponse } = require("../utils/response");
const adminService = require("../services/admin.service"); // Reusing adminService for manager functions
const { registerUserSchema, updateUserRoleSchema } = require("../dto/user.dto");

// @desc    Get list of admins
// @route   GET /api/manager/admins
// @access  Private/Manager
const getAdmins = asyncHandler(async (req, res) => {
  const pagination = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
  };

  const { admins, totalPages, currentPage } = await adminService.getAdmins(pagination);
  successResponse(res, "Admins fetched successfully", { admins, totalPages, currentPage });
});

// @desc    Add new admin
// @route   POST /api/manager/admins
// @access  Private/Manager
const addAdmin = asyncHandler(async (req, res) => {
  const { email, password, name, phone } = req.body;

  const { error } = registerUserSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const admin = await adminService.addAdmin({ email, password, name, phone });
  successResponse(res, "Admin added successfully", admin, 201);
});

// @desc    Delete an admin
// @route   DELETE /api/manager/admins/:id
// @access  Private/Manager
const deleteAdmin = asyncHandler(async (req, res) => {
  const result = await adminService.deleteAdmin(req.params.id);
  successResponse(res, result.message);
});

// @desc    Change admin role
// @route   PATCH /api/manager/admins/:id/role
// @access  Private/Manager
const changeAdminRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const { error } = updateUserRoleSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const result = await adminService.changeAdminRole(req.params.id, role);
  successResponse(res, result.message);
});

module.exports = {
  getAdmins,
  addAdmin,
  deleteAdmin,
  changeAdminRole,
};

