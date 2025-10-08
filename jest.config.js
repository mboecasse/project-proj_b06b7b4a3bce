// File: jest.config.js
// Generated: 2025-10-08 12:06:28 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_ncbehnt9uxq1

module.exports = {
  testEnvironment: 'node',

  coverageDirectory: 'coverage',

  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/app.js',
    '!src/config/**',
    '!src/**/*.test.js',
    '!src/**/*.spec.js'
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/'
  ],

  verbose: true,

  clearMocks: true,

  resetMocks: true,

  restoreMocks: true,

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@validators/(.*)$': '<rootDir>/src/validators/$1'
  },

  testTimeout: 10000,

  maxWorkers: '50%',

  bail: false,

  errorOnDeprecated: true,

  collectCoverage: false,

  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],

  globals: {
    'NODE_ENV': 'test'
  },

  moduleFileExtensions: [
    'js',
    'json',
    'node'
  ],

  watchPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/'
  ]
};
