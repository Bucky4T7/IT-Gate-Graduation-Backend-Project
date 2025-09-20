const Review = require("../models/review.model");
const Item = require("../models/item.model");
const Order = require("../models/order.model");

const getReviewsByItem = async (itemId) => {
  const reviews = await Review.find({ itemId, isDeleted: false }).populate("userId", "name");
  return reviews;
};

const addReview = async (userId, itemId, reviewData) => {
  const item = await Item.findById(itemId);
  if (!item || item.isDeleted) {
    throw new Error("Item not found");
  }

  // Check if the user has purchased the item
  const hasPurchased = await Order.exists({
    userId,
    "items.itemId": itemId,
    status: { $in: ["Shipped", "Delivered"] },
  });

  if (!hasPurchased) {
    throw new Error("You can only review items you have purchased and received.");
  }

  // Check if the user has already reviewed this item
  const existingReview = await Review.findOne({ userId, itemId });
  if (existingReview) {
    throw new Error("You have already reviewed this item.");
  }

  const review = new Review({ userId, itemId, ...reviewData });
  await review.save();
  return review;
};

const updateReview = async (reviewId, userId, updateData) => {
  const review = await Review.findOne({ _id: reviewId, userId, isDeleted: false });
  if (!review) {
    throw new Error("Review not found or you are not authorized to update it.");
  }

  Object.assign(review, updateData);
  await review.save();
  return review;
};

const deleteReview = async (reviewId, userId) => {
  const review = await Review.findOne({ _id: reviewId, userId, isDeleted: false });
  if (!review) {
    throw new Error("Review not found or you are not authorized to delete it.");
  }

  review.isDeleted = true;
  await review.save();
  return { message: "Review soft-deleted successfully" };
};

const getAllReviews = async (filters, pagination) => {
  const { itemId, userId, rating } = filters;
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;

  const query = { isDeleted: false };
  if (itemId) {
    query.itemId = itemId;
  }
  if (userId) {
    query.userId = userId;
  }
  if (rating) {
    query.rating = rating;
  }

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const reviews = await Review.find(query)
    .populate("userId", "name")
    .populate("itemId", "name")
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Review.countDocuments(query);

  return {
    reviews,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  };
};

module.exports = {
  getReviewsByItem,
  addReview,
  updateReview,
  deleteReview,
  getAllReviews,
};

