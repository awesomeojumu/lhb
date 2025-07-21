const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { updateProfileValidation } = require('../validations/userValidation');
const {
  getAllUsers,
  getUserById,
  updateProfile,
  deleteUser,
  getUserProfile,
} = require('../controllers/userController');

router.put('/me', protect, updateProfileValidation, validate, updateProfile);
router.get('/me', protect, getUserProfile);

router.get('/:id', protect, authorizeRoles('commander', 'commando'), getUserById);
router.put('/:id', protect, authorizeRoles('commander', 'commando'), updateProfileValidation, validate, updateProfile);
// Admin/Commander endpoints
router.get('/', protect, authorizeRoles('commander', 'commando'), getAllUsers);
router.delete('/:id', protect, authorizeRoles('commander', 'commando'), deleteUser);

module.exports = router;
