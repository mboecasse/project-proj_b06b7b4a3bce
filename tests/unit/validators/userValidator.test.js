// File: tests/unit/validators/userValidator.test.js
// Generated: 2025-10-08 12:07:17 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_1z6ilk8u4ro2


const { body, validationResult } = require('express-validator');

const { validateUser, validateUserUpdate } = require('../../../src/validators/userValidator');

describe('User Validator', () => {
  describe('validateUser - Create User Validation', () => {
    it('should pass validation with valid user data', () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'SecurePass123!',
          age: 25
        }
      };

      const validations = validateUser;
      let errors = [];

      validations.forEach(validation => {
        const result = validation.run(req);
        if (result && result.errors) {
          errors = errors.concat(result.errors);
        }
      });

      expect(errors.length).toBe(0);
    });

    it('should fail validation when username is missing', () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'SecurePass123!',
          age: 25
        }
      };

      const validations = validateUser;
      const errors = [];

      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'username')).toBe(true);
    });

    it('should fail validation when username is too short', () => {
      const req = {
        body: {
          username: 'ab',
          email: 'test@example.com',
          password: 'SecurePass123!',
          age: 25
        }
      };

      const validations = validateUser;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'username' && err.msg.includes('at least 3'))).toBe(true);
    });

    it('should fail validation when username is too long', () => {
      const req = {
        body: {
          username: 'a'.repeat(31),
          email: 'test@example.com',
          password: 'SecurePass123!',
          age: 25
        }
      };

      const validations = validateUser;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'username' && err.msg.includes('no more than 30'))).toBe(true);
    });

    it('should fail validation when email is missing', () => {
      const req = {
        body: {
          username: 'testuser',
          password: 'SecurePass123!',
          age: 25
        }
      };

      const validations = validateUser;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'email')).toBe(true);
    });

    it('should fail validation when email format is invalid', () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'invalid-email',
          password: 'SecurePass123!',
          age: 25
        }
      };

      const validations = validateUser;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'email' && err.msg.includes('valid email'))).toBe(true);
    });

    it('should normalize email to lowercase', () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'TEST@EXAMPLE.COM',
          password: 'SecurePass123!',
          age: 25
        }
      };

      const validations = validateUser;
      validations.forEach(validation => {
        validation.run(req);
      });

      expect(req.body.email).toBe('test@example.com');
    });

    it('should fail validation when password is missing', () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          age: 25
        }
      };

      const validations = validateUser;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'password')).toBe(true);
    });

    it('should fail validation when password is too short', () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'Short1!',
          age: 25
        }
      };

      const validations = validateUser;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'password' && err.msg.includes('at least 8'))).toBe(true);
    });

    it('should fail validation when age is not a number', () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'SecurePass123!',
          age: 'twenty-five'
        }
      };

      const validations = validateUser;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'age')).toBe(true);
    });

    it('should fail validation when age is below minimum', () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'SecurePass123!',
          age: 17
        }
      };

      const validations = validateUser;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'age' && err.msg.includes('at least 18'))).toBe(true);
    });

    it('should fail validation when age is above maximum', () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'SecurePass123!',
          age: 121
        }
      };

      const validations = validateUser;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'age' && err.msg.includes('no more than 120'))).toBe(true);
    });

    it('should pass validation when age is optional and not provided', () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'SecurePass123!'
        }
      };

      const validations = validateUser;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(true);
    });

    it('should sanitize and trim all string inputs', () => {
      const req = {
        body: {
          username: '  testuser  ',
          email: '  TEST@EXAMPLE.COM  ',
          password: '  SecurePass123!  ',
          age: 25
        }
      };

      const validations = validateUser;
      validations.forEach(validation => {
        validation.run(req);
      });

      expect(req.body.username).toBe('testuser');
      expect(req.body.email).toBe('test@example.com');
      expect(req.body.password).toBe('SecurePass123!');
    });
  });

  describe('validateUserUpdate - Update User Validation', () => {
    it('should pass validation with valid update data', () => {
      const req = {
        body: {
          username: 'updateduser',
          email: 'updated@example.com',
          age: 30
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(true);
    });

    it('should pass validation when only username is provided', () => {
      const req = {
        body: {
          username: 'updateduser'
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(true);
    });

    it('should pass validation when only email is provided', () => {
      const req = {
        body: {
          email: 'updated@example.com'
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(true);
    });

    it('should pass validation when only age is provided', () => {
      const req = {
        body: {
          age: 30
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation when username is too short', () => {
      const req = {
        body: {
          username: 'ab'
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'username' && err.msg.includes('at least 3'))).toBe(true);
    });

    it('should fail validation when username is too long', () => {
      const req = {
        body: {
          username: 'a'.repeat(31)
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'username' && err.msg.includes('no more than 30'))).toBe(true);
    });

    it('should fail validation when email format is invalid', () => {
      const req = {
        body: {
          email: 'invalid-email-format'
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'email' && err.msg.includes('valid email'))).toBe(true);
    });

    it('should normalize email to lowercase on update', () => {
      const req = {
        body: {
          email: 'UPDATED@EXAMPLE.COM'
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      expect(req.body.email).toBe('updated@example.com');
    });

    it('should fail validation when age is below minimum', () => {
      const req = {
        body: {
          age: 15
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'age' && err.msg.includes('at least 18'))).toBe(true);
    });

    it('should fail validation when age is above maximum', () => {
      const req = {
        body: {
          age: 125
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'age' && err.msg.includes('no more than 120'))).toBe(true);
    });

    it('should fail validation when age is not a number', () => {
      const req = {
        body: {
          age: 'thirty'
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().some(err => err.path === 'age')).toBe(true);
    });

    it('should not allow password updates', () => {
      const req = {
        body: {
          username: 'updateduser',
          password: 'NewPassword123!'
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(req.body.password).toBeUndefined();
    });

    it('should sanitize and trim all string inputs on update', () => {
      const req = {
        body: {
          username: '  updateduser  ',
          email: '  UPDATED@EXAMPLE.COM  ',
          age: 30
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      expect(req.body.username).toBe('updateduser');
      expect(req.body.email).toBe('updated@example.com');
    });

    it('should pass validation with empty body', () => {
      const req = {
        body: {}
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(true);
    });

    it('should handle multiple validation errors', () => {
      const req = {
        body: {
          username: 'ab',
          email: 'invalid-email',
          age: 15
        }
      };

      const validations = validateUserUpdate;
      validations.forEach(validation => {
        validation.run(req);
      });

      const result = validationResult(req);
      expect(result.isEmpty()).toBe(false);
      expect(result.array().length).toBeGreaterThan(1);
      expect(result.array().some(err => err.path === 'username')).toBe(true);
      expect(result.array().some(err => err.path === 'email')).toBe(true);
      expect(result.array().some(
