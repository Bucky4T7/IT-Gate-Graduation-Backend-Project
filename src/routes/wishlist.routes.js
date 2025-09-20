const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { getMyWishlist, addItemToWishlist, removeItemFromWishlist } = require("../controllers/wishlist.controller");

const router = express.Router();

router.route("/")
  .get(protect, authorize("User"), getMyWishlist);

router.route("/:itemId")
  .post(protect, authorize("User"), addItemToWishlist)
  .delete(protect, authorize("User"), removeItemFromWishlist);

module.exports = router;

