// File: tests/integration/userRoutes.test.js
// Generated: 2025-10-08 12:07:47 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_d836w0bzm4dq


const app = require('../../src/app');


const request = require('supertest');

describe('User Routes Integration Tests', () => {
  describe('GET /api/users', () => {
    it('should return 200 and list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle query parameters for pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should handle invalid query parameters', async () => {
      const response = await request(app)
        .get('/api/users?page=invalid&limit=abc')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 200 and user data for valid ID', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id');
    });

    it('should return 404 for non-existent user', async () => {
      const userId = '507f1f77bcf86cd799439099';
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/users/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/invalid/i);
    });
  });

  describe('POST /api/users', () => {
    it('should create user with valid data', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        age: 30
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(newUser.email);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 400 for missing required fields', async () => {
      const invalidUser = {
        name: 'John Doe'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/email|password/i);
    });

    it('should return 400 for invalid email format', async () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePass123!'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/email/i);
    });

    it('should return 400 for weak password', async () => {
      const invalidUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/password/i);
    });

    it('should return 409 for duplicate email', async () => {
      const user = {
        name: 'Jane Doe',
        email: 'existing@example.com',
        password: 'SecurePass123!'
      };

      await request(app).post('/api/users').send(user);

      const response = await request(app)
        .post('/api/users')
        .send(user)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/already exists|duplicate/i);
    });

    it('should sanitize and validate input data', async () => {
      const userWithXSS = {
        name: '<script>alert("xss")</script>John',
        email: 'test@example.com',
        password: 'SecurePass123!'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userWithXSS)
        .expect(201);

      expect(response.body.data.name).not.toContain('<script>');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user with valid data', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = {
        name: 'Updated Name',
        age: 35
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
    });

    it('should return 404 for non-existent user', async () => {
      const userId = '507f1f77bcf86cd799439099';
      const updateData = { name: 'Updated Name' };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid update data', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const invalidData = {
        email: 'invalid-email-format'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should not allow updating password through PUT', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = {
        password: 'NewPassword123!'
      };

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/password/i);
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('should partially update user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const patchData = { age: 40 };

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .send(patchData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.age).toBe(patchData.age);
    });

    it('should validate partial update data', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const invalidData = { age: 'not-a-number' };

      const response = await request(app)
        .patch(`/api/users/${userId}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user with valid ID', async () => {
      const userId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/deleted/i);
    });

    it('should return 404 for non-existent user', async () => {
      const userId = '507f1f77bcf86cd799439099';

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .delete('/api/users/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/users/nonexistent/route')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send('{"invalid json"}')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle server errors gracefully', async () => {
      const response = await request(app)
        .get('/api/users/trigger-error')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).not.toContain('stack');
    });
  });

  describe('Content-Type Validation', () => {
    it('should accept application/json content type', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePass123!'
      };

      const response = await request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should reject unsupported content types', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Content-Type', 'text/plain')
        .send('plain text data')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on endpoints', async () => {
      const requests = [];
      for (let i = 0; i < 150; i++) {
        requests.push(request(app).get('/api/users'));
      }

      const responses = await Promise.all(requests);
      const rateLimited = responses.some(res => res.status === 429);

      expect(rateLimited).toBe(true);
    });
  });

  describe('Response Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });

    it('should include CORS headers', async () => {
      const response = await request(app)
        .options('/api/users')
        .expect(204);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});
