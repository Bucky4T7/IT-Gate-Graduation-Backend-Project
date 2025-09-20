const express = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const adminRoutes = require("./admin.routes");
const managerRoutes = require("./manager.routes");
const itemRoutes = require("./item.routes");
const orderRoutes = require("./order.routes");
const wishlistRoutes = require("./wishlist.routes");
const reviewRoutes = require("./review.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/manager", managerRoutes);
router.use("/items", itemRoutes);
router.use("/orders", orderRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/reviews", reviewRoutes);

module.exports = router;

