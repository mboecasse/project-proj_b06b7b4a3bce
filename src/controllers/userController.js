// File: src/controllers/userController.js
// Generated: 2025-10-08 12:06:58 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_9v3w8z991n0z


const logger = require('../utils/logger');

const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');

// In-memory storage for testing

let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date().toISOString() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date().toISOString() }
];


let nextId = 3;

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    logger.info('Fetching all users', { count: users.length });

    const response = formatSuccessResponse(users, 'Users retrieved successfully');
    return res.status(200).json(response);
  } catch (error) {
    logger.error('Error fetching all users', { error: error.message, stack: error.stack });
    next(error);
  }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getUserById = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      logger.warn('Invalid user ID format', { id: req.params.id });
      const response = formatErrorResponse('Invalid user ID format');
      return res.status(400).json(response);
    }

    logger.info('Fetching user by ID', { userId });

    const user = users.find(u => u.id === userId);

    if (!user) {
      logger.warn('User not found', { userId });
      const response = formatErrorResponse('User not found');
      return res.status(404).json(response);
    }

    const response = formatSuccessResponse(user, 'User retrieved successfully');
    return res.status(200).json(response);
  } catch (error) {
    logger.error('Error fetching user by ID', {
      userId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

/**
 * Create new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      logger.warn('Missing required fields for user creation', { name, email });
      const response = formatErrorResponse('Name and email are required');
      return res.status(400).json(response);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.warn('Invalid email format', { email });
      const response = formatErrorResponse('Invalid email format');
      return res.status(400).json(response);
    }

    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      logger.warn('Email already exists', { email });
      const response = formatErrorResponse('Email already exists');
      return res.status(409).json(response);
    }

    const newUser = {
      id: nextId++,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    logger.info('User created successfully', { userId: newUser.id, email: newUser.email });

    const response = formatSuccessResponse(newUser, 'User created successfully');
    return res.status(201).json(response);
  } catch (error) {
    logger.error('Error creating user', {
      body: req.body,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

/**
 * Update user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { name, email } = req.body;

    if (isNaN(userId)) {
      logger.warn('Invalid user ID format for update', { id: req.params.id });
      const response = formatErrorResponse('Invalid user ID format');
      return res.status(400).json(response);
    }

    if (!name && !email) {
      logger.warn('No fields to update', { userId });
      const response = formatErrorResponse('At least one field (name or email) is required for update');
      return res.status(400).json(response);
    }

    logger.info('Updating user', { userId, name, email });

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      logger.warn('User not found for update', { userId });
      const response = formatErrorResponse('User not found');
      return res.status(404).json(response);
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        logger.warn('Invalid email format for update', { email });
        const response = formatErrorResponse('Invalid email format');
        return res.status(400).json(response);
      }

      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== userId);
      if (existingUser) {
        logger.warn('Email already exists for another user', { email, userId });
        const response = formatErrorResponse('Email already exists');
        return res.status(409).json(response);
      }

      users[userIndex].email = email.trim().toLowerCase();
    }

    if (name) {
      users[userIndex].name = name.trim();
    }

    users[userIndex].updatedAt = new Date().toISOString();

    logger.info('User updated successfully', { userId });

    const response = formatSuccessResponse(users[userIndex], 'User updated successfully');
    return res.status(200).json(response);
  } catch (error) {
    logger.error('Error updating user', {
      userId: req.params.id,
      body: req.body,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

/**
 * Delete user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      logger.warn('Invalid user ID format for deletion', { id: req.params.id });
      const response = formatErrorResponse('Invalid user ID format');
      return res.status(400).json(response);
    }

    logger.info('Deleting user', { userId });

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      logger.warn('User not found for deletion', { userId });
      const response = formatErrorResponse('User not found');
      return res.status(404).json(response);
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);

    logger.info('User deleted successfully', { userId });

    const response = formatSuccessResponse(deletedUser, 'User deleted successfully');
    return res.status(200).json(response);
  } catch (error) {
    logger.error('Error deleting user', {
      userId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};
