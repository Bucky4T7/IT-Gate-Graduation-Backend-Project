const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { getAdmins, addAdmin, deleteAdmin, changeAdminRole } = require("../controllers/manager.controller");

const router = express.Router();

// Manager specific routes
router.route("/admins")
  .get(protect, authorize("Manager"), getAdmins)
  .post(protect, authorize("Manager"), addAdmin);

router.route("/admins/:id")
  .delete(protect, authorize("Manager"), deleteAdmin)
  .patch(protect, authorize("Manager"), changeAdminRole);

module.exports = router;

