import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shopping Cart Module API',
      version: '1.0.0',
      description: 'REST API documentation for FlumenX Shopping Cart Module (Product Catalog & Cart Operations)',
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development Server (Port 5001)',
      },
      {
        url: 'http://localhost:5000',
        description: 'Alternative Port 5000',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '669b7f1a2c3d4e0011223344' },
            name: { type: 'string', example: 'AeroSound Max Headphones' },
            description: { type: 'string', example: 'Premium wireless over-ear headphones.' },
            price: { type: 'number', example: 299.99 },
            stock: { type: 'integer', example: 12 },
            image: { type: 'string', example: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '669b7f1a2c3d4e0055667788' },
            productId: { $ref: '#/components/schemas/Product' },
            quantity: { type: 'integer', example: 2 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AddToCartInput: {
          type: 'object',
          required: ['productId', 'quantity'],
          properties: {
            productId: { type: 'string', example: '669b7f1a2c3d4e0011223344' },
            quantity: { type: 'integer', example: 1, minimum: 1 },
          },
        },
        UpdateCartInput: {
          type: 'object',
          required: ['quantity'],
          properties: {
            quantity: { type: 'integer', example: 3, minimum: 1 },
          },
        },
        PaginatedProducts: {
          type: 'object',
          properties: {
            products: {
              type: 'array',
              items: { $ref: '#/components/schemas/Product' },
            },
            total: { type: 'integer', example: 15 },
            page: { type: 'integer', example: 1 },
            pages: { type: 'integer', example: 3 },
            limit: { type: 'integer', example: 6 },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Insufficient stock available' },
          },
        },
      },
    },
    paths: {
      '/products': {
        get: {
          summary: 'Get all products with pagination, search, and stock/price filters',
          tags: ['Products'],
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search term for name or description' },
            { name: 'inStock', in: 'query', schema: { type: 'boolean' }, description: 'Filter by products with stock > 0' },
            { name: 'minPrice', in: 'query', schema: { type: 'number' }, description: 'Minimum price filter' },
            { name: 'maxPrice', in: 'query', schema: { type: 'number' }, description: 'Maximum price filter' },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 6 }, description: 'Products per page' },
          ],
          responses: {
            200: {
              description: 'Paginated list of products',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PaginatedProducts' },
                },
              },
            },
          },
        },
      },
      '/products/{id}': {
        get: {
          summary: 'Get a product by ID',
          tags: ['Products'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ID' },
          ],
          responses: {
            200: {
              description: 'Product details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Product' },
                },
              },
            },
            404: {
              description: 'Product not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/cart': {
        get: {
          summary: 'Get all cart items',
          tags: ['Cart'],
          responses: {
            200: {
              description: 'List of cart items with populated product info',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CartItem' },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Add a product to cart or increase quantity',
          tags: ['Cart'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AddToCartInput' },
              },
            },
          },
          responses: {
            201: {
              description: 'Cart item added or updated',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CartItem' },
                },
              },
            },
            400: {
              description: 'Validation error or stock limit exceeded',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
      '/cart/{id}': {
        put: {
          summary: 'Update item quantity in cart',
          tags: ['Cart'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Cart Item ID or Product ID' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateCartInput' },
              },
            },
          },
          responses: {
            200: {
              description: 'Updated cart item',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CartItem' },
                },
              },
            },
            400: {
              description: 'Validation error or stock limit exceeded',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
        delete: {
          summary: 'Remove an item from cart',
          tags: ['Cart'],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Cart Item ID or Product ID' },
          ],
          responses: {
            200: {
              description: 'Item removed successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'Item removed from cart successfully' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Cart item not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
