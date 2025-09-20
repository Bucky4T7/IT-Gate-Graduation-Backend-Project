const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { createOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus } = require("../controllers/order.controller");

const router = express.Router();

// User specific order routes
router.route("/")
  .post(protect, authorize("User"), createOrder);

router.get("/my", protect, authorize("User"), getMyOrders);
router.get("/:id", protect, authorize("User"), getOrderById);
router.patch("/:id/cancel", protect, authorize("User"), cancelOrder);

// Admin/Manager specific order routes
router.route("/")
  .get(protect, authorize("Admin", "Manager"), getAllOrders); // This route will handle /api/orders GET for admin/manager

router.patch("/:id/status", protect, authorize("Admin", "Manager"), updateOrderStatus);

module.exports = router;

