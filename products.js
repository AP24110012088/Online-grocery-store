// backend/routes/products.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /products - Fetch all products (with optional category filter)
router.get('/', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM products';
  const params = [];

  if (category && category !== 'All') {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY category, name';

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(results);
  });
});

// GET /products/categories - Get all unique categories
router.get('/categories', (req, res) => {
  db.query('SELECT DISTINCT category FROM products ORDER BY category', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
    const categories = ['All', ...results.map(r => r.category)];
    res.json(categories);
  });
});

module.exports = router;
