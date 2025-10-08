// File: src/middleware/validator.js
// Generated: 2025-10-08 12:06:49 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_8ol3k8igr2pe


const logger = require('../utils/logger');

const { errorResponse } = require('../utils/responseFormatter');

const { validationResult } = require('express-validator');

/**
 * Middleware to handle express-validator validation errors
 * Extracts validation errors and returns consistent error response
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object|void} Error response or calls next()
 */


const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    logger.warn('Validation failed', {
      path: req.path,
      method: req.method,
      errors: errorMessages,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    return res.status(400).json(
      errorResponse('Validation failed', errorMessages)
    );
  }

  next();
};

/**
 * Factory function to create validation middleware with custom error handling
 * Useful for specific routes that need different validation behavior
 *
 * @param {Object} options - Configuration options
 * @param {number} options.statusCode - HTTP status code for validation errors (default: 400)
 * @param {string} options.message - Custom error message (default: 'Validation failed')
 * @returns {Function} Express middleware function
 */


const createValidator = (options = {}) => {
  const {
    statusCode = 400,
    message = 'Validation failed'
  } = options;

  return (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }));

      logger.warn('Validation failed', {
        path: req.path,
        method: req.method,
        errors: errorMessages,
        customMessage: message,
        ip: req.ip
      });

      return res.status(statusCode).json(
        errorResponse(message, errorMessages)
      );
    }

    next();
  };
};

/**
 * Middleware to sanitize validated data
 * Removes any fields not explicitly validated
 *
 * @param {Array<string>} allowedFields - Array of field names to keep
 * @returns {Function} Express middleware function
 */


const sanitizeFields = (allowedFields) => {
  return (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      const sanitized = {};

      allowedFields.forEach(field => {
        if (req.body.hasOwnProperty(field)) {
          sanitized[field] = req.body[field];
        }
      });

      req.body = sanitized;

      logger.debug('Request body sanitized', {
        path: req.path,
        allowedFields,
        sanitizedKeys: Object.keys(sanitized)
      });
    }

    next();
  };
};

module.exports = {
  validate,
  createValidator,
  sanitizeFields
};
