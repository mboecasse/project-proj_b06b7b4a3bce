// File: src/routes/userRoutes.js
// Generated: 2025-10-08 12:06:57 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_kc6a34b1auqq


const express = require('express');


const userController = require('../controllers/userController');

const { body } = require('express-validator');

const { validate } = require('../middleware/validator');


const router = express.Router();


const createUserValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150')
];


const updateUserValidation = [
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('age')
    .optional()
    .isInt({ min: 0, max: 150 })
    .withMessage('Age must be between 0 and 150')
];

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', validate(createUserValidation), userController.createUser);
router.put('/:id', validate(updateUserValidation), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
