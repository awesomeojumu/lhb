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
} = require('../controllers/userController');

router.get('/me', protect, getUserById); // Current user's data (you can modify to getUserProfile)
router.put('/me', protect, updateProfileValidation, validate, updateProfile);

// Admin/Commander endpoints
router.get('/', protect, authorizeRoles('commander', 'commando'), getAllUsers);
router.delete('/:id', protect, authorizeRoles('commander', 'commando'), deleteUser);

module.exports = router;
