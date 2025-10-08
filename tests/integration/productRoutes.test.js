// File: tests/integration/productRoutes.test.js
// Generated: 2025-10-08 12:07:51 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_pd02ljlmcdan


const app = require('../../src/app');


const request = require('supertest');

describe('Product API Integration Tests', () => {
  describe('POST /api/products', () => {
    it('should create a product with valid data', async () => {
      const validProduct = {
        name: 'Test Product',
        price: 29.99,
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(validProduct)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(validProduct.name);
      expect(response.body.data.price).toBe(validProduct.price);
      expect(response.body.message).toBe('Product created successfully');
    });

    it('should reject product with missing name', async () => {
      const invalidProduct = {
        price: 29.99,
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('name');
    });

    it('should reject product with invalid price (negative)', async () => {
      const invalidProduct = {
        name: 'Test Product',
        price: -10,
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('price');
    });

    it('should reject product with invalid price (zero)', async () => {
      const invalidProduct = {
        name: 'Test Product',
        price: 0,
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('price');
    });

    it('should reject product with invalid price (string)', async () => {
      const invalidProduct = {
        name: 'Test Product',
        price: 'invalid',
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('price');
    });

    it('should reject product with name too short', async () => {
      const invalidProduct = {
        name: 'AB',
        price: 29.99,
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('name');
    });

    it('should reject product with name too long', async () => {
      const invalidProduct = {
        name: 'A'.repeat(201),
        price: 29.99,
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('name');
    });

    it('should reject product with description too long', async () => {
      const invalidProduct = {
        name: 'Test Product',
        price: 29.99,
        description: 'A'.repeat(1001),
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('description');
    });

    it('should accept product without optional description', async () => {
      const validProduct = {
        name: 'Test Product',
        price: 29.99,
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(validProduct)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(validProduct.name);
    });

    it('should accept product without optional category', async () => {
      const validProduct = {
        name: 'Test Product',
        price: 29.99,
        description: 'A test product description'
      };

      const response = await request(app)
        .post('/api/products')
        .send(validProduct)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(validProduct.name);
    });

    it('should sanitize HTML in product name', async () => {
      const productWithHTML = {
        name: '<script>alert("xss")</script>Test Product',
        price: 29.99,
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(productWithHTML)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).not.toContain('<script>');
      expect(response.body.data.name).not.toContain('</script>');
    });

    it('should sanitize HTML in product description', async () => {
      const productWithHTML = {
        name: 'Test Product',
        price: 29.99,
        description: '<img src=x onerror=alert("xss")>Description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(productWithHTML)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.description).not.toContain('<img');
      expect(response.body.data.description).not.toContain('onerror');
    });

    it('should trim whitespace from product name', async () => {
      const productWithWhitespace = {
        name: '  Test Product  ',
        price: 29.99,
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(productWithWhitespace)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Product');
    });

    it('should reject product with price exceeding maximum', async () => {
      const invalidProduct = {
        name: 'Test Product',
        price: 1000001,
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('price');
    });

    it('should reject product with empty string name', async () => {
      const invalidProduct = {
        name: '',
        price: 29.99,
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('name');
    });

    it('should reject product with null price', async () => {
      const invalidProduct = {
        name: 'Test Product',
        price: null,
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('price');
    });

    it('should handle multiple validation errors', async () => {
      const invalidProduct = {
        name: 'AB',
        price: -10,
        description: 'A'.repeat(1001),
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should reject product with additional unexpected fields', async () => {
      const productWithExtraFields = {
        name: 'Test Product',
        price: 29.99,
        description: 'A test product description',
        category: 'Electronics',
        unexpectedField: 'should be rejected'
      };

      const response = await request(app)
        .post('/api/products')
        .send(productWithExtraFields)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).not.toHaveProperty('unexpectedField');
    });

    it('should accept product with decimal price', async () => {
      const validProduct = {
        name: 'Test Product',
        price: 29.995,
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(validProduct)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.price).toBeCloseTo(29.995, 2);
    });

    it('should accept product with minimum valid price', async () => {
      const validProduct = {
        name: 'Test Product',
        price: 0.01,
        description: 'A test product description',
        category: 'Electronics'
      };

      const response = await request(app)
        .post('/api/products')
        .send(validProduct)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.price).toBe(0.01);
    });
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return empty array when no products exist', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a product by id', async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          price: 29.99,
          description: 'A test product description',
          category: 'Electronics'
        });

      const productId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(productId);
      expect(response.body.data.name).toBe('Test Product');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/999999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for invalid product id format', async () => {
      const response = await request(app)
        .get('/api/products/invalid-id')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product with valid data', async () => {
      const createResponse = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          price: 29.99,
          description: 'A test product description',
          category: 'Electronics'
        });

      const productId = createResponse.body.data.id;

      const updatedData = {
        name: 'Updated Product',
        price: 39.99,
        description: 'Updated description',
        category: 'Updated Category'
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updatedData.name);
      expect(response.body.data.price).toBe(updatedData.price);
      expect(response.body.message
