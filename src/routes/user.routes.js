const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { getMyProfile, updateMyProfile, softDeleteMyProfile, changeMyPassword, uploadMyAvatar } = require("../controllers/user.controller");
const { uploadAvatar, uploadErrorHandler } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.route("/me")
  .get(protect, getMyProfile)
  .patch(protect, updateMyProfile)
  .delete(protect, authorize("User"), softDeleteMyProfile);

router.patch("/me/change-password", protect, changeMyPassword);
router.post("/me/avatar", protect, uploadAvatar, uploadErrorHandler, uploadMyAvatar);

module.exports = router;

