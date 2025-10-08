// File: src/middleware/rateLimiter.js
// Generated: 2025-10-08 12:06:49 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_3gql4hsigfjs


const logger = require('../utils/logger');


const rateLimit = require('express-rate-limit');

/**
 * Rate limiter configuration for general API endpoints
 * Limits requests to prevent abuse and ensure service availability
 */


const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // 100 requests per window default
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      userAgent: req.get('user-agent')
    });
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later'
    });
  },
  skip: (req) => {
    // Skip rate limiting for health check endpoints
    return req.path === '/health' || req.path === '/api/health';
  }
});

/**
 * Strict rate limiter for authentication endpoints
 * More restrictive to prevent brute force attacks
 */


const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes default
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || '5', 10), // 5 attempts per window default
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logger.error('Authentication rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      userAgent: req.get('user-agent')
    });
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again later'
    });
  }
});

/**
 * Lenient rate limiter for public read-only endpoints
 * Allows more requests for data retrieval operations
 */


const publicLimiter = rateLimit({
  windowMs: parseInt(process.env.PUBLIC_RATE_LIMIT_WINDOW_MS || '60000', 10), // 1 minute default
  max: parseInt(process.env.PUBLIC_RATE_LIMIT_MAX_REQUESTS || '60', 10), // 60 requests per minute default
  message: {
    success: false,
    error: 'Too many requests, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Public rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method
    });
    res.status(429).json({
      success: false,
      error: 'Too many requests, please slow down'
    });
  }
});

/**
 * Strict rate limiter for write operations
 * Prevents spam and abuse of resource creation
 */


const createLimiter = rateLimit({
  windowMs: parseInt(process.env.CREATE_RATE_LIMIT_WINDOW_MS || '3600000', 10), // 1 hour default
  max: parseInt(process.env.CREATE_RATE_LIMIT_MAX_REQUESTS || '10', 10), // 10 creates per hour default
  message: {
    success: false,
    error: 'Too many creation requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Create rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      userAgent: req.get('user-agent')
    });
    res.status(429).json({
      success: false,
      error: 'Too many creation requests, please try again later'
    });
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  publicLimiter,
  createLimiter
};
