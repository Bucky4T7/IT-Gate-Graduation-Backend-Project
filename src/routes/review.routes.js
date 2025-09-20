const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { getReviewsByItem, addReview, updateReview, deleteReview, getAllReviews } = require("../controllers/review.controller");

const router = express.Router();

// Public route to get reviews for a specific item
router.get("/:itemId", getReviewsByItem);

// User specific review routes
router.route("/:itemId")
  .post(protect, authorize("User"), addReview);

router.route("/:id")
  .put(protect, authorize("User"), updateReview)
  .delete(protect, authorize("User"), deleteReview);

// Admin/Manager specific route to get all reviews
router.get("/", protect, authorize("Admin", "Manager"), getAllReviews);

module.exports = router;

