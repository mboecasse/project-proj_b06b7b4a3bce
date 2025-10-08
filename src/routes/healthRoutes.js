// File: src/routes/healthRoutes.js
// Generated: 2025-10-08 12:06:33 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_ehgt052mutye


const express = require('express');


const logger = require('../utils/logger');


const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB'
      },
      cpu: {
        user: process.cpuUsage().user,
        system: process.cpuUsage().system
      }
    };

    logger.info('Health check performed', {
      status: healthStatus.status,
      uptime: healthStatus.uptime
    });

    res.status(200).json({
      success: true,
      data: healthStatus,
      message: 'System is healthy'
    });
  } catch (error) {
    logger.error('Health check failed', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
});

router.get('/status', async (req, res) => {
  try {
    const statusInfo = {
      service: 'Simple Node.js API',
      version: process.env.npm_package_version || '1.0.0',
      node_version: process.version,
      platform: process.platform,
      pid: process.pid,
      timestamp: new Date().toISOString()
    };

    logger.info('Status check performed');

    res.status(200).json({
      success: true,
      data: statusInfo,
      message: 'Status retrieved successfully'
    });
  } catch (error) {
    logger.error('Status check failed', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Status check failed'
    });
  }
});

router.get('/ready', async (req, res) => {
  try {
    const readinessChecks = {
      server: true,
      timestamp: new Date().toISOString()
    };

    const allReady = Object.values(readinessChecks).every(check =>
      typeof check === 'boolean' ? check : true
    );

    logger.info('Readiness check performed', { ready: allReady });

    if (allReady) {
      res.status(200).json({
        success: true,
        data: readinessChecks,
        message: 'Service is ready'
      });
    } else {
      res.status(503).json({
        success: false,
        error: 'Service not ready',
        data: readinessChecks
      });
    }
  } catch (error) {
    logger.error('Readiness check failed', {
      error: error.message,
      stack: error.stack
    });

    res.status(503).json({
      success: false,
      error: 'Readiness check failed'
    });
  }
});

module.exports = router;
