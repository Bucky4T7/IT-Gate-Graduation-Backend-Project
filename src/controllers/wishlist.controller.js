const asyncHandler = require("express-async-handler");
const { successResponse, errorResponse } = require("../utils/response");
const wishlistService = require("../services/wishlist.service");
const { addItemToWishlistSchema } = require("../dto/wishlist.dto");

// @desc    Get logged-in user wishlist
// @route   GET /api/wishlist
// @access  Private/User
const getMyWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getMyWishlist(req.user._id);
  successResponse(res, "Wishlist fetched successfully", wishlist);
});

// @desc    Add item to wishlist
// @route   POST /api/wishlist/:itemId
// @access  Private/User
const addItemToWishlist = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const { error } = addItemToWishlistSchema.safeParse({ itemId });
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const wishlist = await wishlistService.addItemToWishlist(req.user._id, itemId);
  successResponse(res, "Item added to wishlist successfully", wishlist, 201);
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:itemId
// @access  Private/User
const removeItemFromWishlist = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const { error } = addItemToWishlistSchema.safeParse({ itemId });
  if (error) {
    return errorResponse(res, error.errors[0].message, 400);
  }

  const result = await wishlistService.removeItemFromWishlist(req.user._id, itemId);
  successResponse(res, result.message);
});

module.exports = {
  getMyWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
};

