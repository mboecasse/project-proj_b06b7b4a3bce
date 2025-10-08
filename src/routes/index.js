// File: src/routes/index.js
// Generated: 2025-10-08 12:06:29 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_o7ekgmmajd89


const express = require('express');


const logger = require('../utils/logger');


const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    },
    message: 'API is running'
  });
});

// API info endpoint
router.get('/', (req, res) => {
  logger.info('API info requested');
  res.json({
    success: true,
    data: {
      name: 'Simple Node.js API',
      version: '1.0.0',
      description: 'API for validation testing',
      endpoints: {
        health: '/api/health',
        info: '/api/'
      }
    },
    message: 'Welcome to the API'
  });
});

// Mount additional route modules here as they are created
// Example:
// const userRoutes = require('./userRoutes');
// router.use('/users', userRoutes);

// 404 handler for undefined API routes
router.use('*', (req, res) => {
  logger.warn('Route not found', {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip
  });
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

module.exports = router;
