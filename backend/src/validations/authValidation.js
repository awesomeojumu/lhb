const { body } = require('express-validator');

exports.registerValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['commander', 'commando', 'specialForce', 'globalSoldier'])
    .withMessage('Invalid role'),
  body('battalion')
    .optional()
    .isIn(['Alpha', 'Bravo', 'Charlie', 'Delta'])
    .withMessage('Invalid battalion'),
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.forgotPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
];

exports.resetPasswordValidation = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
