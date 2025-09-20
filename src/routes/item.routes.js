const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { createItem, getAllItems, getItemById, updateItem, softDeleteItem } = require("../controllers/item.controller");
const { uploadItemImages, uploadErrorHandler } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.route("/")
  .post(protect, authorize("Admin", "Manager"), uploadItemImages, uploadErrorHandler, createItem)
  .get(getAllItems);

router.route("/:id")
  .get(getItemById)
  .patch(protect, authorize("Admin", "Manager"), uploadItemImages, uploadErrorHandler, updateItem)
  .delete(protect, authorize("Admin", "Manager"), softDeleteItem);

// Additional route for filtering by category (as per spec)
router.get("/filter", getAllItems); // Reusing getAllItems with category filter from query params

module.exports = router;

