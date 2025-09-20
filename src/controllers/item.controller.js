const asyncHandler = require("express-async-handler");
const { successResponse, errorResponse } = require("../utils/response");
const itemService = require("../services/item.service");
const { createItemSchema, updateItemSchema } = require("../dto/item.dto");

// @desc    Create new item
// @route   POST /api/items
// @access  Private/Admin/Manager
const createItem = asyncHandler(async (req, res) => {
  const { error } = createItemSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const imageUrls = req.files ? req.files.map(file => `/uploads/items/${file.filename}`) : [];
  if (imageUrls.length > 5) {
    return errorResponse(res, "Maximum 5 images allowed per item", 400);
  }

  const item = await itemService.createItem(req.body, imageUrls);
  successResponse(res, "Item created successfully", item, 201);
});

// @desc    Get all items with filters
// @route   GET /api/items
// @access  Public
const getAllItems = asyncHandler(async (req, res) => {
  const filters = {
    search: req.query.search,
    category: req.query.category,
    minPrice: parseFloat(req.query.minPrice),
    maxPrice: parseFloat(req.query.maxPrice),
  };
  const pagination = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const { items, totalPages, currentPage } = await itemService.getAllItems(filters, pagination);
  successResponse(res, "Items fetched successfully", { items, totalPages, currentPage });
});

// @desc    Get single item details
// @route   GET /api/items/:id
// @access  Public
const getItemById = asyncHandler(async (req, res) => {
  const item = await itemService.getItemById(req.params.id);
  successResponse(res, "Item fetched successfully", item);
});

// @desc    Update item
// @route   PATCH /api/items/:id
// @access  Private/Admin/Manager
const updateItem = asyncHandler(async (req, res) => {
  const { error } = updateItemSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const imageUrls = req.files ? req.files.map(file => `/uploads/items/${file.filename}`) : [];
  if (imageUrls.length > 5) {
    return errorResponse(res, "Maximum 5 images allowed per item", 400);
  }

  const item = await itemService.updateItem(req.params.id, req.body, imageUrls);
  successResponse(res, "Item updated successfully", item);
});

// @desc    Delete item (soft delete)
// @route   DELETE /api/items/:id
// @access  Private/Admin/Manager
const softDeleteItem = asyncHandler(async (req, res) => {
  const result = await itemService.softDeleteItem(req.params.id);
  successResponse(res, result.message);
});

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  softDeleteItem,
};

