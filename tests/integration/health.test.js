// File: tests/integration/health.test.js
// Generated: 2025-10-08 12:07:30 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_zp5jj2egszfg


const app = require('../../src/app');


const request = require('supertest');

describe('Health Check Endpoints', () => {
  describe('GET /health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'healthy');
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('uptime');
    });

    it('should return valid timestamp format', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      const timestamp = response.body.data.timestamp;
      expect(timestamp).toBeDefined();
      expect(new Date(timestamp).toString()).not.toBe('Invalid Date');
    });

    it('should return positive uptime', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      const uptime = response.body.data.uptime;
      expect(uptime).toBeDefined();
      expect(typeof uptime).toBe('number');
      expect(uptime).toBeGreaterThanOrEqual(0);
    });

    it('should return consistent response structure', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          status: 'healthy',
          timestamp: expect.any(String),
          uptime: expect.any(Number)
        }),
        message: expect.any(String)
      });
    });
  });

  describe('GET /api/health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'healthy');
    });

    it('should include environment information', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.data).toHaveProperty('environment');
      expect(typeof response.body.data.environment).toBe('string');
    });

    it('should include service name', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.data).toHaveProperty('service');
      expect(typeof response.body.data.service).toBe('string');
    });
  });

  describe('Health Check Performance', () => {
    it('should respond within acceptable time', async () => {
      const startTime = Date.now();

      await request(app)
        .get('/health')
        .expect(200);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() =>
        request(app).get('/health').expect(200)
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe('healthy');
      });
    });
  });

  describe('Health Check Headers', () => {
    it('should include proper content-type header', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should not include sensitive headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['x-powered-by']).toBeUndefined();
    });
  });

  describe('Error Scenarios', () => {
    it('should handle invalid health endpoint gracefully', async () => {
      const response = await request(app)
        .get('/health/invalid')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle malformed requests', async () => {
      await request(app)
        .get('/health')
        .set('Content-Type', 'invalid')
        .expect(200);
    });
  });

  describe('Health Check Caching', () => {
    it('should not cache health check responses', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers['cache-control']).toMatch(/no-cache|no-store/);
    });
  });

  describe('Multiple Health Endpoints', () => {
    it('should provide consistent data across endpoints', async () => {
      const response1 = await request(app)
        .get('/health')
        .expect(200);

      const response2 = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response1.body.data.status).toBe(response2.body.data.status);
    });
  });
});
