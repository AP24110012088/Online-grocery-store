-- DAILY BASKET Database Schema
-- Run this file in MySQL to set up the database

CREATE DATABASE IF NOT EXISTS daily_basket;
USE daily_basket;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image_url TEXT NOT NULL,
  unit VARCHAR(30) DEFAULT '1 unit',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Table
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert Sample Products
INSERT INTO products (name, price, category, image_url, unit) VALUES
('Fresh Organic Bananas', 29.00, 'Fruits', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80', '1 dozen'),
('Red Apples', 120.00, 'Fruits', 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80', '1 kg'),
('Whole Milk', 62.00, 'Dairy', 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80', '1 litre'),
('Farm Fresh Eggs', 89.00, 'Dairy', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80', '12 pcs'),
('Baby Spinach', 45.00, 'Vegetables', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80', '250 g'),
('Broccoli', 55.00, 'Vegetables', 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80', '500 g'),
('Sourdough Bread', 75.00, 'Bakery', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', '400 g loaf'),
('Basmati Rice', 110.00, 'Grains', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80', '1 kg'),
('Greek Yogurt', 99.00, 'Dairy', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80', '400 g'),
('Tomatoes', 40.00, 'Vegetables', 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80', '500 g'),
('Orange Juice', 85.00, 'Beverages', 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80', '1 litre'),
('Avocado', 70.00, 'Fruits', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80', '2 pcs');
