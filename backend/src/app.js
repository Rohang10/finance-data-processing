'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();

// ─── Swagger / OpenAPI Setup ───────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Data Processing API',
      version: '1.0.0',
      description: 'Backend API for Finance Data Processing — Node.js + PostgreSQL',
    },
    servers: [],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication & session endpoints' },
      { name: 'Users', description: 'User management (admin only)' },
      { name: 'Records', description: 'Financial records CRUD' },
      { name: 'Dashboard', description: 'Aggregated analytics' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ─── Security & Parsing ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── HTTP Logging ──────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

const pool = require('./config/database');

// ─── Welcome / Status ──────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Finance Data Processing API is running',
    database: 'Connected ✅',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

// ─── Health & Keep-Alive Endpoint ─────────────────────────────────────────
app.get('/health', async (req, res) => {
  const startTime = Date.now();
  try {
    const result = await pool.query('SELECT NOW() AS server_time, current_database() AS db');
    const latency = Date.now() - startTime;
    res.status(200).json({
      status: 'healthy',
      database: 'connected',
      latency: `${latency}ms`,
      server_time: result.rows[0].server_time,
      database_name: result.rows[0].db,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ─── Swagger UI ────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── API Routes ────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/records', require('./routes/records'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// ─── 404 Handler ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message,
  });
});

module.exports = app;
