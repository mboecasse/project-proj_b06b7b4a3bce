.
├── src/
│   ├── config/
│   │   └── env.js                      # Environment configuration loader
│   ├── controllers/
│   │   ├── productController.js        # Product business logic
│   │   └── userController.js           # User business logic
│   ├── middleware/
│   │   ├── errorHandler.js             # Global error handling middleware
│   │   ├── rateLimiter.js              # Rate limiting configuration
│   │   ├── requestLogger.js            # Request/response logging
│   │   ├── security.js                 # Security headers and CORS
│   │   └── validator.js                # Validation middleware wrapper
│   ├── routes/
│   │   ├── healthRoutes.js             # Health check endpoints
│   │   ├── index.js                    # Route aggregator
│   │   ├── productRoutes.js            # Product API routes
│   │   └── userRoutes.js               # User API routes
│   ├── utils/
│   │   ├── logger.js                   # Winston logger configuration
│   │   └── responseFormatter.js        # Standardized response format
│   ├── validators/
│   │   ├── productValidator.js         # Product validation schemas
│   │   └── userValidator.js            # User validation schemas
│   ├── app.js                          # Express app configuration
│   └── server.js                       # HTTP server initialization
├── tests/
│   ├── integration/
│   │   ├── health.test.js              # Health endpoint tests
│   │   ├── productRoutes.test.js       # Product API integration tests
│   │   └── userRoutes.test.js          # User API integration tests
│   ├── unit/
│   │   ├── controllers/
│   │   │   └── userController.test.js  # User controller unit tests
│   │   └── validators/
│   │       └── userValidator.test.js   # User validation unit tests
│   └── setup.js                        # Jest test configuration
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore rules
├── jest.config.js                      # Jest testing configuration
├── package.json                        # Project dependencies and scripts
└── README.md                           # Project documentation
