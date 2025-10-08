// File: src/middleware/security.js
// Generated: 2025-10-08 12:07:00 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_yw67n3akray2


const config = require('../config/env');


const cors = require('cors');


const helmet = require('helmet');


const hpp = require('hpp');


const logger = require('../utils/logger');


const mongoSanitize = require('express-mongo-sanitize');


const rateLimit = require('express-rate-limit');


const xss = require('xss-clean');

/**
 * Configure CORS options based on environment
 * @returns {Object} CORS configuration object
 */


const getCorsOptions = () => {
  const allowedOrigins = config.cors.allowedOrigins || ['http://localhost:3000'];

  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || config.env === 'development') {
        callback(null, true);
      } else {
        logger.warn('CORS blocked request', { origin, allowedOrigins });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400
  };
};

/**
 * Configure Helmet security headers
 * @returns {Object} Helmet configuration object
 */


const getHelmetOptions = () => {
  return {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true
  };
};

/**
 * Configure rate limiting
 * @returns {Object} Rate limiter middleware
 */


const getRateLimiter = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: config.rateLimit?.maxRequests || 100,
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        method: req.method
      });
      res.status(429).json({
        success: false,
        error: 'Too many requests from this IP, please try again later'
      });
    },
    skip: (req) => {
      const whitelist = config.rateLimit?.whitelist || [];
      return whitelist.includes(req.ip);
    }
  });
};

/**
 * Configure strict rate limiting for authentication endpoints
 * @returns {Object} Strict rate limiter middleware
 */


const getAuthRateLimiter = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
      success: false,
      error: 'Too many authentication attempts, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Auth rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        method: req.method
      });
      res.status(429).json({
        success: false,
        error: 'Too many authentication attempts, please try again later'
      });
    }
  });
};

/**
 * Apply all security middleware to Express app
 * @param {Object} app - Express application instance
 */


const applySecurityMiddleware = (app) => {
  try {
    app.use(helmet(getHelmetOptions()));
    logger.info('Helmet security headers configured');

    app.use(cors(getCorsOptions()));
    logger.info('CORS configured', {
      allowedOrigins: config.cors.allowedOrigins || ['http://localhost:3000']
    });

    app.use(xss());
    logger.info('XSS protection enabled');

    app.use(mongoSanitize({
      replaceWith: '_',
      onSanitize: ({ req, key }) => {
        logger.warn('MongoDB injection attempt detected', {
          ip: req.ip,
          key,
          path: req.path
        });
      }
    }));
    logger.info('MongoDB injection protection enabled');

    app.use(hpp({
      whitelist: []
    }));
    logger.info('HTTP parameter pollution protection enabled');

    app.use('/api/', getRateLimiter());
    logger.info('Rate limiting configured', {
      maxRequests: config.rateLimit?.maxRequests || 100,
      windowMs: 15 * 60 * 1000
    });

    app.set('trust proxy', 1);
    logger.info('Trust proxy enabled for rate limiting');

    logger.info('All security middleware applied successfully');
  } catch (error) {
    logger.error('Failed to apply security middleware', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Security headers middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */


const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.removeHeader('X-Powered-By');
  next();
};

/**
 * Content type validation middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */


const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      logger.warn('Invalid content type', {
        contentType,
        method: req.method,
        path: req.path,
        ip: req.ip
      });
      return res.status(415).json({
        success: false,
        error: 'Content-Type must be application/json'
      });
    }
  }
  next();
};

/**
 * Request size limit middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */


const requestSizeLimit = (req, res, next) => {
  const maxSize = config.maxRequestSize || 10485760;
  const contentLength = parseInt(req.get('Content-Length') || '0', 10);

  if (contentLength > maxSize) {
    logger.warn('Request size exceeded', {
      contentLength,
      maxSize,
      path: req.path,
      ip: req.ip
    });
    return res.status(413).json({
      success: false,
      error: 'Request entity too large'
    });
  }
  next();
};

module.exports = {
  applySecurityMiddleware,
  getCorsOptions,
  getHelmetOptions,
  getRateLimiter,
  getAuthRateLimiter,
  securityHeaders,
  validateContentType,
  requestSizeLimit
};
