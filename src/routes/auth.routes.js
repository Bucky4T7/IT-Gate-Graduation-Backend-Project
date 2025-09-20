const express = require("express");
const { register, verifyOtp, login, refresh, logout, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", protect, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;

