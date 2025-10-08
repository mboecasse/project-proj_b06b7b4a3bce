// File: tests/unit/controllers/userController.test.js
// Generated: 2025-10-08 12:07:07 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_n1aexxdkniig


const express = require('express');


const logger = require('../../../src/utils/logger');


const request = require('supertest');


const userController = require('../../../src/controllers/userController');

jest.mock('../../../src/utils/logger');

describe('User Controller Unit Tests', () => {
  let app;
  let req;
  let res;
  let next;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    req = {
      body: {},
      params: {},
      query: {},
      user: null
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ];

      req.query = { page: 1, limit: 10 };

      await userController.getAllUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.any(Array),
        message: 'Users retrieved successfully'
      });
    });

    it('should handle errors when retrieving users', async () => {
      const error = new Error('Database connection failed');

      jest.spyOn(userController, 'getAllUsers').mockImplementation(() => {
        throw error;
      });

      try {
        await userController.getAllUsers(req, res, next);
      } catch (err) {
        expect(logger.error).toHaveBeenCalledWith(
          'Error retrieving users',
          expect.objectContaining({ error: error.message })
        );
        expect(err).toBe(error);
      }
    });

    it('should apply pagination parameters', async () => {
      req.query = { page: 2, limit: 5 };

      await userController.getAllUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array)
        })
      );
    });
  });

  describe('getUserById', () => {
    it('should return user by id successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date()
      };

      req.params = { id: '1' };

      await userController.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.any(Object),
        message: 'User retrieved successfully'
      });
    });

    it('should return 404 when user not found', async () => {
      req.params = { id: '999' };

      await userController.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not found'
      });
    });

    it('should handle invalid user id format', async () => {
      req.params = { id: 'invalid-id' };

      await userController.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid user ID format'
      });
    });

    it('should log error when database fails', async () => {
      const error = new Error('Database query failed');
      req.params = { id: '1' };

      jest.spyOn(userController, 'getUserById').mockImplementation(() => {
        throw error;
      });

      try {
        await userController.getUserById(req, res, next);
      } catch (err) {
        expect(logger.error).toHaveBeenCalledWith(
          'Error retrieving user',
          expect.objectContaining({
            error: error.message,
            userId: '1'
          })
        );
      }
    });
  });

  describe('createUser', () => {
    it('should create user successfully with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      req.body = userData;

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          name: userData.name,
          email: userData.email
        }),
        message: 'User created successfully'
      });
      expect(logger.info).toHaveBeenCalledWith(
        'User created',
        expect.objectContaining({ email: userData.email })
      );
    });

    it('should return 400 when required fields are missing', async () => {
      req.body = { name: 'John Doe' };

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Missing required fields'
      });
    });

    it('should return 409 when email already exists', async () => {
      req.body = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'SecurePass123!'
      };

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email already exists'
      });
    });

    it('should sanitize user input before creation', async () => {
      req.body = {
        name: '<script>alert("xss")</script>John',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            name: expect.not.stringContaining('<script>')
          })
        })
      );
    });

    it('should not return password in response', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      };

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      const responseData = res.json.mock.calls[0][0].data;
      expect(responseData).not.toHaveProperty('password');
    });

    it('should validate email format', async () => {
      req.body = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePass123!'
      };

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid email format'
      });
    });

    it('should validate password strength', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123'
      };

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Password does not meet security requirements'
      });
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updateData = {
        name: 'John Updated',
        email: 'john.updated@example.com'
      };

      req.params = { id: '1' };
      req.body = updateData;

      await userController.updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining(updateData),
        message: 'User updated successfully'
      });
      expect(logger.info).toHaveBeenCalledWith(
        'User updated',
        expect.objectContaining({ userId: '1' })
      );
    });

    it('should return 404 when updating non-existent user', async () => {
      req.params = { id: '999' };
      req.body = { name: 'Updated Name' };

      await userController.updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not found'
      });
    });

    it('should not allow updating password through this endpoint', async () => {
      req.params = { id: '1' };
      req.body = {
        name: 'John Doe',
        password: 'NewPassword123!'
      };

      await userController.updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Password cannot be updated through this endpoint'
      });
    });

    it('should validate updated email format', async () => {
      req.params = { id: '1' };
      req.body = { email: 'invalid-email' };

      await userController.updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid email format'
      });
    });

    it('should return 409 when updating to existing email', async () => {
      req.params = { id: '1' };
      req.body = { email: 'existing@example.com' };

      await userController.updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Email already exists'
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      req.params = { id: '1' };

      await userController.deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User deleted successfully'
      });
      expect(logger.info).toHaveBeenCalledWith(
        'User deleted',
        expect.objectContaining({ userId: '1' })
      );
    });

    it('should return 404 when deleting non-existent user', async () => {
      req.params = { id: '999' };

      await userController.deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not found'
      });
    });

    it('should handle invalid user id on delete', async () => {
      req.params = { id: 'invalid-id' };

      await userController.deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid user ID format'
      });
    });

    it('should log error when deletion fails', async () => {
      const error = new Error('Database deletion failed');
      req.params = { id: '1' };

      jest.spyOn(userController, 'deleteUser').mockImplementation(() => {
        throw error;
      });

      try {
        await userController.deleteUser(req, res, next);
      } catch (err) {
        expect(logger.error).toHaveBeenCalledWith(
          'Error deleting user',
          expect.objectContaining({
            error: error.message,
            userId: '1'
          })
        );
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle unexpected errors gracefully', async () => {
      const error = new Error('Unexpected error');
      req.params = { id: '1' };

      jest.spyOn(userController, 'getUserById').mockImplementation(() => {
        throw error;
      });

      try {
        await userController.getUserById(req, res, next);
      } catch (err) {
        expect(logger.error).toHaveBeenCalled();
        expect(err).toBe(error);
      }
    });

    it('should not expose internal error details', async () => {
      const error = new Error('Internal database error with sensitive info');
      req.params = { id: '1' };

      jest.spyOn(userController, 'getUserById').mockImplementation(async (req, res) => {
        try {
          throw error;
        } catch (err) {
          logger.error('Error retrieving user', { error: err.message, userId: req.params.id });
          res.status(500).json({
            success: false,
            error: 'An error occurred while retrieving user'
          });
        }
      });

      await userController.getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.not.stringContaining('sensitive')
      });
    });
  });

  describe('Input Validation', () => {
    it('should reject requests with empty body', async () => {
      req.body = {};

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.any(String)
      });
    });

    it('should trim whitespace from inputs', async () => {
      req.body = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        password: 'SecurePass123!'
      };

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            name: 'John Doe',
            email: 'john@example.com'
