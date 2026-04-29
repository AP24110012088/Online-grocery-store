// backend/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // Change to your MySQL username
  password: '',         // Change to your MySQL password
  database: 'daily_basket'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database: daily_basket');
});

module.exports = db;
