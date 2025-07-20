const express = require('express');
const router = express.Router();
const validate = require('../middleware/validateMiddleware');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require('../validations/authValidation');
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidation, validate, resetPassword);

module.exports = router;
