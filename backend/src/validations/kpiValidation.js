const { body } = require('express-validator');

exports.createKPIValidation = [
  body('title').notEmpty().withMessage('KPI title is required'),
  body('description').optional().isString(),
  body('target').notEmpty().withMessage('KPI target is required'),
  body('deadline')
    .notEmpty()
    .withMessage('Deadline is required')
    .isISO8601()
    .toDate()
    .withMessage('Deadline must be a valid date'),
  body('assignmentType')
    .optional()
    .isIn(['all', 'role', 'specific'])
    .withMessage('Invalid assignment type'),
  body('role')
    .if(body('assignmentType').equals('role'))
    .notEmpty()
    .withMessage('Role required for role-based assignment'),
  body('userIds')
    .if(body('assignmentType').equals('specific'))
    .isArray({ min: 1 })
    .withMessage('At least one user ID required for specific assignment'),
];

exports.updateKPIStatusValidation = [
  body('progress').optional().isNumeric().withMessage('Progress must be a number'),
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Invalid status'),
];
