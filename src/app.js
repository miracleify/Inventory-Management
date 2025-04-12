// src/app.js

// src/app.js

const express = require('express');
const app = express();

// Import route modules
const productRoutes = require('./routes/productRoutes');
const salesRoutes = require('./routes/salesRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // New routes for product categories

const { pool } = require('../config/database');  // ✅ This correctly extracts the pool from the exported object

// Middleware: Parse JSON payloads
app.use(express.json());

// Route registration
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('✅ Welcome to the Inventory Management System API!');
});

// Test database connection route
app.get('/test-db-connection', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // Simple query to check DB connection
    console.log('Database connected successfully:', result.rows[0]);
    res.status(200).send('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).send('Database connection failed');
  }
});

module.exports = app;
