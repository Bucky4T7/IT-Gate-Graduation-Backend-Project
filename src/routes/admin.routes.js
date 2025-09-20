const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { getAllUsers, getUserById, blockUser, unblockUser, changeUserRole, deleteUser, updateAdminProfile } = require("../controllers/admin.controller");

const router = express.Router();

// Admin/Manager specific routes for user management
router.route("/users")
  .get(protect, authorize("Admin", "Manager"), getAllUsers);

router.route("/users/:id")
  .get(protect, authorize("Admin", "Manager"), getUserById);

router.patch("/users/:id/block", protect, authorize("Admin", "Manager"), blockUser);
router.patch("/users/:id/unblock", protect, authorize("Admin", "Manager"), unblockUser);
router.patch("/users/:id/role", protect, authorize("Admin", "Manager"), changeUserRole);
router.delete("/users/:id/delete", protect, authorize("Admin", "Manager"), deleteUser);

// Admin/Manager own profile update
router.patch("/profile", protect, authorize("Admin", "Manager"), updateAdminProfile);

module.exports = router;

