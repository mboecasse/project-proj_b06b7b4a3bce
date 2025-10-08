// File: src/app.js
// Generated: 2025-10-08 12:07:11 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_utojpxtb3o0k


const config = require('./config/env');


const cors = require('cors');


const errorHandler = require('./middleware/errorHandler');


const express = require('express');


const helmet = require('helmet');


const logger = require('./utils/logger');


const rateLimiter = require('./middleware/rateLimiter');


const requestLogger = require('./middleware/requestLogger');


const routes = require('./routes');


const securityMiddleware = require('./middleware/security');


const app = express();

// Trust proxy for rate limiting and security headers
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(securityMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv
    },
    message: 'Service is running'
  });
});

// API routes
app.use('/api', routes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown handler
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    promise,
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined
  });
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

module.exports = app;
