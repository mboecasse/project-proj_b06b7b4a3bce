// File: src/utils/logger.js
// Generated: 2025-10-08 12:06:29 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_7lrtv4bilaum


const path = require('path');


const winston = require('winston');


const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};


const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(logColors);


const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);


const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => {
      const { timestamp, level, message, ...meta } = info;
      const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
      return `${timestamp} [${level}]: ${message} ${metaString}`;
    }
  )
);


const transports = [
  new winston.transports.Console({
    format: consoleFormat,
    level: process.env.LOG_LEVEL || 'info',
  }),
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
    format: logFormat,
    maxsize: 5242880,
    maxFiles: 5,
  }),
  new winston.transports.File({
    filename: path.join('logs', 'combined.log'),
    format: logFormat,
    maxsize: 5242880,
    maxFiles: 5,
  }),
];


const logger = winston.createLogger({
  levels: logLevels,
  format: logFormat,
  transports,
  exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';
}

logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

module.exports = logger;
