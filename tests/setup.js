// File: tests/setup.js
// Generated: 2025-10-08 12:06:30 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_9it5w9fnfar2


const logger = require('../src/utils/logger');


const mongoose = require('mongoose');

const { MongoMemoryServer } = require('mongodb-memory-server');


let mongoServer;

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('Test database connected', { uri: mongoUri });
  } catch (error) {
    logger.error('Failed to setup test database', { error: error.message });
    throw error;
  }
});

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }

    if (mongoServer) {
      await mongoServer.stop();
    }

    logger.info('Test database disconnected');
  } catch (error) {
    logger.error('Failed to cleanup test database', { error: error.message });
    throw error;
  }
});

afterEach(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      const collections = mongoose.connection.collections;

      for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
      }
    }
  } catch (error) {
    logger.error('Failed to clear test collections', { error: error.message });
    throw error;
  }
});

global.testLogger = logger;

jest.setTimeout(30000);

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1h';
process.env.PORT = '3001';

jest.mock('../src/utils/logger', () => {
  const actualLogger = jest.requireActual('../src/utils/logger');
  return {
    ...actualLogger,
    error: jest.fn(actualLogger.error),
    warn: jest.fn(actualLogger.warn),
    info: jest.fn(actualLogger.info),
    debug: jest.fn(actualLogger.debug),
  };
});
