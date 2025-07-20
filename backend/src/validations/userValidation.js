const { body } = require('express-validator');

exports.updateProfileValidation = [
  body('firstName').optional().isString().isLength({ min: 2 }).withMessage('First name too short'),
  body('lastName').optional().isString().isLength({ min: 2 }).withMessage('Last name too short'),
  body('email').optional().isEmail().withMessage('Valid email required'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number required'),
  body('sex')
    .optional()
    .isIn(['Male', 'Female'])
    .withMessage('Sex must be Male or Female'),
  body('ageBracket')
    .optional()
    .isIn(['18-25', '26-35', '36-45', '46-60', '60+'])
    .withMessage('Invalid age bracket'),
  body('battalion')
    .optional()
    .isIn(['Alpha', 'Bravo', 'Charlie', 'Delta'])
    .withMessage('Invalid battalion'),
];
