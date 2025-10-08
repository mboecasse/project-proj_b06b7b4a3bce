// File: src/routes/productRoutes.js
// Generated: 2025-10-08 12:07:07 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_z09r48x64j9q


const express = require('express');


const productController = require('../controllers/productController');

const { body, param, query } = require('express-validator');

const { validate } = require('../middleware/validator');


const router = express.Router();

// Validation rules


const createProductValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];


const updateProductValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];


const productIdValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format')
];


const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a non-negative number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a non-negative number'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
];

// Routes
router.get('/', validate(queryValidation), productController.getAllProducts);

router.get('/:id', validate(productIdValidation), productController.getProductById);

router.post('/', validate(createProductValidation), productController.createProduct);

router.put('/:id', validate(updateProductValidation), productController.updateProduct);

router.delete('/:id', validate(productIdValidation), productController.deleteProduct);

module.exports = router;
