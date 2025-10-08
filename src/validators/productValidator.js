// File: src/validators/productValidator.js
// Generated: 2025-10-08 12:06:46 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_ehb5k69olhui


const { body, param, query } = require('express-validator');


const createProductValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,&()]+$/)
    .withMessage('Product name contains invalid characters'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Price must be a positive number between 0.01 and 999999.99')
    .custom((value) => {
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) {
        throw new Error('Price cannot have more than 2 decimal places');
      }
      return true;
    }),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0, max: 999999 })
    .withMessage('Quantity must be a non-negative integer between 0 and 999999'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters')
];


const updateProductValidation = [
  param('id')
    .notEmpty()
    .withMessage('Product ID is required')
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('Invalid product ID format'),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Product name cannot be empty if provided')
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,&()]+$/)
    .withMessage('Product name contains invalid characters'),

  body('price')
    .optional()
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Price must be a positive number between 0.01 and 999999.99')
    .custom((value) => {
      if (value !== undefined && value !== null) {
        const decimalPlaces = (value.toString().split('.')[1] || '').length;
        if (decimalPlaces > 2) {
          throw new Error('Price cannot have more than 2 decimal places');
        }
      }
      return true;
    }),

  body('quantity')
    .optional()
    .isInt({ min: 0, max: 999999 })
    .withMessage('Quantity must be a non-negative integer between 0 and 999999'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters')
];


const getProductValidation = [
  param('id')
    .notEmpty()
    .withMessage('Product ID is required')
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('Invalid product ID format')
];


const deleteProductValidation = [
  param('id')
    .notEmpty()
    .withMessage('Product ID is required')
    .matches(/^[a-zA-Z0-9\-_]+$/)
    .withMessage('Invalid product ID format')
];


const listProductsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Page must be a positive integer between 1 and 10000')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100')
    .toInt(),

  query('sortBy')
    .optional()
    .isIn(['name', 'price', 'quantity', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),

  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either asc or desc'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a non-negative number')
    .toFloat(),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a non-negative number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.query.minPrice && parseFloat(value) < parseFloat(req.query.minPrice)) {
        throw new Error('Maximum price must be greater than or equal to minimum price');
      }
      return true;
    }),

  query('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category filter cannot exceed 50 characters'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query cannot exceed 100 characters')
];


const bulkCreateProductsValidation = [
  body('products')
    .isArray({ min: 1, max: 100 })
    .withMessage('Products must be an array with 1 to 100 items'),

  body('products.*.name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_.,&()]+$/)
    .withMessage('Product name contains invalid characters'),

  body('products.*.price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Price must be a positive number between 0.01 and 999999.99'),

  body('products.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0, max: 999999 })
    .withMessage('Quantity must be a non-negative integer between 0 and 999999')
];

module.exports = {
  createProductValidation,
  updateProductValidation,
  getProductValidation,
  deleteProductValidation,
  listProductsValidation,
  bulkCreateProductsValidation
};
