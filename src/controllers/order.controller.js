const asyncHandler = require("express-async-handler");
const { successResponse, errorResponse } = require("../utils/response");
const orderService = require("../services/order.service");
const { createOrderSchema, updateOrderStatusSchema } = require("../dto/order.dto");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/User
const createOrder = asyncHandler(async (req, res) => {
  const { error } = createOrderSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const order = await orderService.createOrder(req.user._id, req.body);
  successResponse(res, "Order created successfully", order, 201);
});

// @desc    Get logged-in user orders
// @route   GET /api/orders/my
// @access  Private/User
const getMyOrders = asyncHandler(async (req, res) => {
  const filters = {
    status: req.query.status,
  };
  const pagination = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const { orders, totalPages, currentPage } = await orderService.getMyOrders(req.user._id, filters, pagination);
  successResponse(res, "User orders fetched successfully", { orders, totalPages, currentPage });
});

// @desc    Get specific order details for logged-in user
// @route   GET /api/orders/:id
// @access  Private/User
const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user._id);
  successResponse(res, "Order details fetched successfully", order);
});

// @desc    Cancel order if status = Pending
// @route   PATCH /api/orders/:id/cancel
// @access  Private/User
const cancelOrder = asyncHandler(async (req, res) => {
  const result = await orderService.cancelOrder(req.params.id, req.user._id);
  successResponse(res, result.message);
});

// @desc    Get all orders (Admin/Manager)
// @route   GET /api/orders
// @access  Private/Admin/Manager
const getAllOrders = asyncHandler(async (req, res) => {
  const filters = {
    status: req.query.status,
    paymentStatus: req.query.paymentStatus,
    userId: req.query.userId, // Allow filtering by user ID for admin/manager
  };
  const pagination = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const { orders, totalPages, currentPage } = await orderService.getAllOrders(filters, pagination);
  successResponse(res, "All orders fetched successfully", { orders, totalPages, currentPage });
});

// @desc    Update order status (Admin/Manager)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin/Manager
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const { error } = updateOrderStatusSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const result = await orderService.updateOrderStatus(req.params.id, status);
  successResponse(res, result.message);
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};

