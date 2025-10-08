// File: src/config/env.js
// Generated: 2025-10-08 12:06:31 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_qeyd865miuq2


const dotenv = require('dotenv');


const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Validates required environment variables
 * @throws {Error} If required environment variables are missing
 */


function validateEnv() {
  const required = [
    'NODE_ENV',
    'PORT',
    'API_VERSION'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate NODE_ENV values
  const validEnvs = ['development', 'production', 'test'];
  if (!validEnvs.includes(process.env.NODE_ENV)) {
    throw new Error(`NODE_ENV must be one of: ${validEnvs.join(', ')}`);
  }

  // Validate PORT is a number
  const port = parseInt(process.env.PORT, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be a valid number between 1 and 65535');
  }

  // Validate API_VERSION format
  if (!/^v\d+$/.test(process.env.API_VERSION)) {
    throw new Error('API_VERSION must be in format v1, v2, etc.');
  }
}

// Validate on load
validateEnv();

/**
 * Environment configuration object
 * Single source of truth for all application configuration
 */


const config = {
  // Application
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  apiVersion: process.env.API_VERSION,

  // Server
  host: process.env.HOST || '0.0.0.0',
  corsOrigin: process.env.CORS_ORIGIN || '*',

  // Logging
  logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),

  // Security
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),

  // Request
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10), // 30 seconds
  bodyLimit: process.env.BODY_LIMIT || '10mb',

  // Helpers
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test'
};

module.exports = config;
