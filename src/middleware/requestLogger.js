// File: src/middleware/requestLogger.js
// Generated: 2025-10-08 12:06:48 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_r28jyape4tdt


const logger = require('../utils/logger');

const { v4: uuidv4 } = require('uuid');

/**
 * HTTP request/response logging middleware
 * Logs incoming requests and outgoing responses with timing information
 * Assigns unique request ID for tracing
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */


const requestLogger = (req, res, next) => {
  const requestId = uuidv4();
  const startTime = Date.now();

  req.requestId = requestId;

  const requestInfo = {
    requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    path: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent') || 'unknown',
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    body: req.method !== 'GET' && req.body && Object.keys(req.body).length > 0
      ? sanitizeBody(req.body)
      : undefined
  };

  logger.info('Incoming request', requestInfo);

  const originalSend = res.send;
  const originalJson = res.json;

  res.send = function(data) {
    res.send = originalSend;
    logResponse(res, startTime, requestId, data);
    return originalSend.call(this, data);
  };

  res.json = function(data) {
    res.json = originalJson;
    logResponse(res, startTime, requestId, data);
    return originalJson.call(this, data);
  };

  res.on('finish', () => {
    if (!res.headersSent) {
      return;
    }

    if (!res._logged) {
      const duration = Date.now() - startTime;
      logger.info('Response sent', {
        requestId,
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`
      });
    }
  });

  next();
};

/**
 * Log response details with timing information
 *
 * @param {Object} res - Express response object
 * @param {number} startTime - Request start timestamp
 * @param {string} requestId - Unique request identifier
 * @param {*} data - Response data
 */


function logResponse(res, startTime, requestId, data) {
  if (res._logged) {
    return;
  }

  res._logged = true;
  const duration = Date.now() - startTime;
  const statusCode = res.statusCode;

  const responseInfo = {
    requestId,
    statusCode,
    duration: `${duration}ms`,
    contentType: res.get('content-type'),
    contentLength: res.get('content-length')
  };

  if (statusCode >= 500) {
    logger.error('Server error response', responseInfo);
  } else if (statusCode >= 400) {
    logger.warn('Client error response', responseInfo);
  } else {
    logger.info('Successful response', responseInfo);
  }
}

/**
 * Sanitize request body to remove sensitive information from logs
 * Removes password, token, secret fields
 *
 * @param {Object} body - Request body object
 * @returns {Object} Sanitized body object
 */


function sanitizeBody(body) {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sensitiveFields = [
    'password',
    'passwordConfirm',
    'currentPassword',
    'newPassword',
    'token',
    'accessToken',
    'refreshToken',
    'secret',
    'apiKey',
    'creditCard',
    'cvv',
    'ssn'
  ];

  const sanitized = { ...body };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  for (const key in sanitized) {
    if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      if (Array.isArray(sanitized[key])) {
        sanitized[key] = sanitized[key].map(item =>
          typeof item === 'object' ? sanitizeBody(item) : item
        );
      } else {
        sanitized[key] = sanitizeBody(sanitized[key]);
      }
    }
  }

  return sanitized;
}

module.exports = requestLogger;
