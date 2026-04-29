// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/cart-page', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/cart.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🛒 DAILY BASKET Server Running`);
  console.log(`📦 API:      http://localhost:${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🛍️  Cart:     http://localhost:${PORT}/cart-page\n`);
});
