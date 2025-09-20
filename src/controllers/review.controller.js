const asyncHandler = require("express-async-handler");
const { successResponse, errorResponse } = require("../utils/response");
const reviewService = require("../services/review.service");
const { createReviewSchema, updateReviewSchema } = require("../dto/review.dto");

// @desc    Get all reviews for an item
// @route   GET /api/reviews/:itemId
// @access  Public
const getReviewsByItem = asyncHandler(async (req, res) => {
  const reviews = await reviewService.getReviewsByItem(req.params.itemId);
  successResponse(res, "Reviews fetched successfully", reviews);
});

// @desc    Add review for an item
// @route   POST /api/reviews/:itemId
// @access  Private/User
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const { error } = createReviewSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const review = await reviewService.addReview(req.user._id, req.params.itemId, { rating, comment });
  successResponse(res, "Review added successfully", review, 201);
});

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  Private/User
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const { error } = updateReviewSchema.safeParse(req.body);
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const review = await reviewService.updateReview(req.params.id, req.user._id, { rating, comment });
  successResponse(res, "Review updated successfully", review);
});

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
// @access  Private/User
const deleteReview = asyncHandler(async (req, res) => {
  const result = await reviewService.deleteReview(req.params.id, req.user._id);
  successResponse(res, result.message);
});

// @desc    Get all reviews (Admin/Manager)
// @route   GET /api/reviews
// @access  Private/Admin/Manager
const getAllReviews = asyncHandler(async (req, res) => {
  const filters = {
    itemId: req.query.itemId,
    userId: req.query.userId,
    rating: parseInt(req.query.rating),
  };
  const pagination = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const { reviews, totalPages, currentPage } = await reviewService.getAllReviews(filters, pagination);
  successResponse(res, "All reviews fetched successfully", { reviews, totalPages, currentPage });
});

module.exports = {
  getReviewsByItem,
  addReview,
  updateReview,
  deleteReview,
  getAllReviews,
};

