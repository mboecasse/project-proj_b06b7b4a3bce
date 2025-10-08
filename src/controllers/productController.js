// File: src/controllers/productController.js
// Generated: 2025-10-08 12:06:57 UTC
// Project ID: proj_b06b7b4a3bce
// Task ID: task_5ognj2r9z9tt


const logger = require('../utils/logger');

const { formatSuccessResponse, formatErrorResponse } = require('../utils/responseFormatter');

// In-memory storage for products

let products = [];

let nextId = 1;

/**
 * Get all products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    logger.info('Fetching all products', { count: products.length });

    const response = formatSuccessResponse(products, 'Products retrieved successfully');
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error fetching products', { error: error.message, stack: error.stack });
    next(error);
  }
};

/**
 * Get product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getProductById = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);

    logger.info('Fetching product by ID', { productId });

    const product = products.find(p => p.id === productId);

    if (!product) {
      logger.warn('Product not found', { productId });
      return res.status(404).json(formatErrorResponse('Product not found'));
    }

    const response = formatSuccessResponse(product, 'Product retrieved successfully');
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error fetching product by ID', {
      productId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

/**
 * Create new product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;

    logger.info('Creating new product', { name, category, price });

    const newProduct = {
      id: nextId++,
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock, 10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);

    logger.info('Product created successfully', { productId: newProduct.id, name: newProduct.name });

    const response = formatSuccessResponse(newProduct, 'Product created successfully');
    res.status(201).json(response);
  } catch (error) {
    logger.error('Error creating product', {
      body: req.body,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

/**
 * Update product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const { name, description, price, category, stock } = req.body;

    logger.info('Updating product', { productId, updates: Object.keys(req.body) });

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      logger.warn('Product not found for update', { productId });
      return res.status(404).json(formatErrorResponse('Product not found'));
    }

    const existingProduct = products[productIndex];

    const updatedProduct = {
      ...existingProduct,
      name: name !== undefined ? name : existingProduct.name,
      description: description !== undefined ? description : existingProduct.description,
      price: price !== undefined ? parseFloat(price) : existingProduct.price,
      category: category !== undefined ? category : existingProduct.category,
      stock: stock !== undefined ? parseInt(stock, 10) : existingProduct.stock,
      updatedAt: new Date().toISOString()
    };

    products[productIndex] = updatedProduct;

    logger.info('Product updated successfully', { productId, name: updatedProduct.name });

    const response = formatSuccessResponse(updatedProduct, 'Product updated successfully');
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error updating product', {
      productId: req.params.id,
      body: req.body,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

/**
 * Delete product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);

    logger.info('Deleting product', { productId });

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      logger.warn('Product not found for deletion', { productId });
      return res.status(404).json(formatErrorResponse('Product not found'));
    }

    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);

    logger.info('Product deleted successfully', { productId, name: deletedProduct.name });

    const response = formatSuccessResponse(deletedProduct, 'Product deleted successfully');
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error deleting product', {
      productId: req.params.id,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

/**
 * Search products by category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    logger.info('Searching products by category', { category });

    const filteredProducts = products.filter(p =>
      p.category.toLowerCase() === category.toLowerCase()
    );

    logger.info('Products found by category', { category, count: filteredProducts.length });

    const response = formatSuccessResponse(filteredProducts, 'Products retrieved successfully');
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error searching products by category', {
      category: req.params.category,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

/**
 * Update product stock
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateProductStock = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id, 10);
    const { stock } = req.body;

    logger.info('Updating product stock', { productId, newStock: stock });

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      logger.warn('Product not found for stock update', { productId });
      return res.status(404).json(formatErrorResponse('Product not found'));
    }

    const stockValue = parseInt(stock, 10);

    if (stockValue < 0) {
      logger.warn('Invalid stock value', { productId, stock: stockValue });
      return res.status(400).json(formatErrorResponse('Stock cannot be negative'));
    }

    products[productIndex].stock = stockValue;
    products[productIndex].updatedAt = new Date().toISOString();

    logger.info('Product stock updated successfully', {
      productId,
      newStock: stockValue
    });

    const response = formatSuccessResponse(products[productIndex], 'Product stock updated successfully');
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error updating product stock', {
      productId: req.params.id,
      body: req.body,
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};
