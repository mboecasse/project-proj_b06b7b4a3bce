// File: src/middleware/errorHandler.js
// Generated: 2025-10-08 12:06:48 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_2r5f3x7r7d3m


const logger = require('../utils/logger');

const { formatErrorResponse } = require('../utils/responseFormatter');

/**
 * Global error handling middleware
 * Catches all errors and formats consistent error responses
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */


const errorHandler = (err, req, res, next) => {
  // Log error with context
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
    timestamp: new Date().toISOString()
  });

  // Determine status code
  let statusCode = err.statusCode || err.status || 500;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
  } else if (err.name === 'ConflictError') {
    statusCode = 409;
  } else if (err.name === 'CastError') {
    statusCode = 400;
  }

  // Determine error message
  let errorMessage = err.message || 'Internal server error';

  // Don't expose internal errors in production
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    errorMessage = 'Internal server error';
  }

  // Send formatted error response
  res.status(statusCode).json(formatErrorResponse(errorMessage));
};

/**
 * Handle 404 errors for undefined routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */


const notFoundHandler = (req, res) => {
  logger.warn('Route not found', {
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  res.status(404).json(formatErrorResponse('Route not found'));
};

module.exports = {
  errorHandler,
  notFoundHandler
};
