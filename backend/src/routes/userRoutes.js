const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { updateProfileValidation } = require("../validations/userValidation");

const {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  getUserProfile,
  updateUserRole,       // ✅ IMPORT THIS HERE
  updateUserBattalion,  // ✅ ADD THIS IMPORT
} = require("../controllers/userController");

// ✅ Current user profile
router.put("/me", protect, updateProfileValidation, validate, updateProfile);
router.get("/me", protect, getUserProfile);

// ✅ Admin/Commander/Commando routes
router.get("/:id", protect, authorizeRoles("commander", "commando"), getUserById);
router.put(
  "/:id",
  protect,
  authorizeRoles("commander", "commando"),
  updateProfileValidation,
  validate,
  updateProfile
);
router.get("/", protect, authorizeRoles("commander", "commando"), getAllUsers);
router.delete("/:id", protect, authorizeRoles("commander", "commando"), deleteUser);

// ✅ Update user role (Commander & Commando)
router.put(
  "/:id/role",
  protect,
  authorizeRoles("commander", "commando"),
  updateUserRole
);

// ✅ Battalion Management (Commander & Commando only)
router.put(
  "/:id/battalion",
  protect,
  authorizeRoles("commander", "commando"),
  updateUserBattalion
);

module.exports = router;
