// File: src/validators/userValidator.js
// Generated: 2025-10-08 12:06:38 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_zvvax46m4cuf


const { body, validationResult } = require('express-validator');


const createUserValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),

  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),

  body('phoneNumber')
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Phone number must be in valid international format'),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13 || age > 120) {
        throw new Error('User must be between 13 and 120 years old');
      }
      return true;
    }),

  body('role')
    .optional()
    .isIn(['user', 'admin', 'moderator'])
    .withMessage('Role must be one of: user, admin, moderator')
];


const updateUserValidation = [
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters'),

  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),

  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),

  body('phoneNumber')
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Phone number must be in valid international format'),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13 || age > 120) {
        throw new Error('User must be between 13 and 120 years old');
      }
      return true;
    }),

  body('role')
    .optional()
    .isIn(['user', 'admin', 'moderator'])
    .withMessage('Role must be one of: user, admin, moderator'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];


const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  createUserValidation,
  updateUserValidation,
  validateRequest
};
