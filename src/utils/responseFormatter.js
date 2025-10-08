// File: src/utils/responseFormatter.js
// Generated: 2025-10-08 12:06:35 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_x9lyu9q7r6at

* @param {*} data - Response data to send
 * @param {string} message - Success message (optional)
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Formatted success response
 */


const successResponse = (data = null, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    data,
    message,
    statusCode
  };
};

/**
 * Format error API response
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Object} details - Additional error details (optional)
 * @returns {Object} Formatted error response
 */


const errorResponse = (error = 'An error occurred', statusCode = 500, details = null) => {
  const response = {
    success: false,
    error,
    statusCode
  };

  if (details && process.env.NODE_ENV !== 'production') {
    response.details = details;
  }

  return response;
};

/**
 * Format validation error response
 * @param {Array} errors - Array of validation errors
 * @returns {Object} Formatted validation error response
 */


const validationErrorResponse = (errors = []) => {
  return {
    success: false,
    error: 'Validation failed',
    errors,
    statusCode: 400
  };
};

/**
 * Format paginated response
 * @param {Array} data - Array of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @param {string} message - Success message (optional)
 * @returns {Object} Formatted paginated response
 */


const paginatedResponse = (data = [], page = 1, limit = 10, total = 0, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    success: true,
    data,
    message,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage
    },
    statusCode: 200
  };
};

/**
 * Send formatted success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */


const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = successResponse(data, message, statusCode);
  res.status(statusCode).json(response);
};

/**
 * Send formatted error response
 * @param {Object} res - Express response object
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} details - Additional error details
 */


const sendError = (res, error = 'An error occurred', statusCode = 500, details = null) => {
  const response = errorResponse(error, statusCode, details);
  res.status(statusCode).json(response);
};

/**
 * Send formatted validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Array of validation errors
 */


const sendValidationError = (res, errors = []) => {
  const response = validationErrorResponse(errors);
  res.status(400).json(response);
};

/**
 * Send formatted paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Array of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @param {string} message - Success message
 */


const sendPaginated = (res, data = [], page = 1, limit = 10, total = 0, message = 'Success') => {
  const response = paginatedResponse(data, page, limit, total, message);
  res.status(200).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  paginatedResponse,
  sendSuccess,
  sendError,
  sendValidationError,
  sendPaginated
};
