# Online-grocery-store
# 🛒 DAILY BASKET – Online Grocery Store

A full-stack online grocery store built with HTML/CSS/JS (Frontend), Node.js + Express.js (Backend), and MySQL (Database).

---

## 📁 Folder Structure

```
DAILY-BASKET/
├── backend/
│   ├── server.js          ← Express server entry point
│   ├── db.js              ← MySQL connection
│   └── routes/
│       ├── products.js    ← GET /products, GET /products/categories
│       └── cart.js        ← GET/POST/PUT/DELETE /cart
├── frontend/
│   ├── index.html         ← Product listing page
│   ├── cart.html          ← Cart page
│   ├── style.css          ← All styles
│   └── main.js            ← Frontend JavaScript
├── database/
│   └── schema.sql         ← DB schema + sample data
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- MySQL (v8+)
- npm

### 2. Database Setup
Open MySQL and run:
```sql
SOURCE /path/to/DAILY-BASKET/database/schema.sql;
```
Or paste the contents of `database/schema.sql` into MySQL Workbench and execute.

### 3. Configure Database Connection
Open `backend/db.js` and update your credentials:
```js
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // ← your MySQL username
  password: 'yourpass', // ← your MySQL password
  database: 'daily_basket'
});
```

### 4. Install Dependencies
```bash
cd DAILY-BASKET
npm install
```

### 5. Start the Server
```bash
npm start
```
Or for development with auto-reload:
```bash
npm run dev
```

### 6. Open in Browser
- 🌐 **Store:** http://localhost:3000
- 🛍️ **Cart:** http://localhost:3000/cart-page

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products?category=Fruits` | Filter by category |
| GET | `/products/categories` | Get all categories |
| GET | `/cart` | Get cart with product details |
| POST | `/cart` | Add item to cart `{ product_id, quantity }` |
| PUT | `/cart/:id` | Update item quantity `{ quantity }` |
| DELETE | `/cart/:id` | Remove item from cart |
| DELETE | `/cart` | Clear entire cart |

---

## ✨ Features

- 🛍️ Product listing with images, price, category
- 🔍 Filter products by category
- ➕ Add to Cart with live feedback
- 🛒 Cart with quantity controls (+/-)
- 💰 Dynamic total with delivery fee & discounts
- 📱 Fully responsive (mobile + desktop)
- 🔔 Toast notifications
- ⚡ Skeleton loading states
- 🎨 Modern grocery UI (BigBasket/Blinkit style)
