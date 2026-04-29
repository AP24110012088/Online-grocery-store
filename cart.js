// backend/routes/cart.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /cart - Fetch all cart items with product details
router.get('/', (req, res) => {
  const query = `
    SELECT 
      cart.id,
      cart.product_id,
      cart.quantity,
      products.name,
      products.price,
      products.image_url,
      products.unit,
      (cart.quantity * products.price) AS subtotal
    FROM cart
    JOIN products ON cart.product_id = products.id
    ORDER BY cart.added_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching cart:', err);
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }
    res.json(results);
  });
});

// POST /cart - Add item to cart
router.post('/', (req, res) => {
  const { product_id, quantity = 1 } = req.body;

  if (!product_id) {
    return res.status(400).json({ error: 'product_id is required' });
  }

  // Check if product already exists in cart
  db.query('SELECT * FROM cart WHERE product_id = ?', [product_id], (err, existing) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (existing.length > 0) {
      // Update quantity if already in cart
      const newQty = existing[0].quantity + parseInt(quantity);
      db.query('UPDATE cart SET quantity = ? WHERE product_id = ?', [newQty, product_id], (err2) => {
        if (err2) return res.status(500).json({ error: 'Failed to update cart' });
        res.json({ message: 'Cart updated', cart_id: existing[0].id, quantity: newQty });
      });
    } else {
      // Insert new cart item
      db.query('INSERT INTO cart (product_id, quantity) VALUES (?, ?)', [product_id, quantity], (err2, result) => {
        if (err2) return res.status(500).json({ error: 'Failed to add to cart' });
        res.status(201).json({ message: 'Added to cart', cart_id: result.insertId });
      });
    }
  });
});

// PUT /cart/:id - Update quantity
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }

  db.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update quantity' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Quantity updated', quantity });
  });
});

// DELETE /cart/:id - Remove item from cart
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM cart WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to remove item' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Item removed from cart' });
  });
});

// DELETE /cart - Clear entire cart
router.delete('/', (req, res) => {
  db.query('DELETE FROM cart', (err) => {
    if (err) return res.status(500).json({ error: 'Failed to clear cart' });
    res.json({ message: 'Cart cleared' });
  });
});

module.exports = router;
