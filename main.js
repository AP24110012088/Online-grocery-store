// frontend/main.js
const API = 'http://localhost:3000';

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check'}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ============================================================
   CART COUNT (shared across pages)
   ============================================================ */
async function updateCartCount() {
  try {
    const res = await fetch(`${API}/cart`);
    const items = await res.json();
    const total = items.reduce((sum, i) => sum + i.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
      badge.textContent = total;
      badge.style.transform = 'scale(1.3)';
      setTimeout(() => badge.style.transform = '', 200);
    }
  } catch (err) {
    console.error('Cart count update failed:', err);
  }
}

/* ============================================================
   INDEX PAGE — Products
   ============================================================ */
if (document.getElementById('products-grid')) {

  let allCategories = [];
  let activeCategory = 'All';

  // Render skeleton loaders while loading
  function showSkeletons(count = 8) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = Array.from({ length: count }, () => `
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton skeleton-line w80"></div>
          <div class="skeleton skeleton-line w50"></div>
          <div class="skeleton skeleton-line w60"></div>
        </div>
      </div>
    `).join('');
  }

  // Render product cards
  function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!products.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon">🥦</div>
          <h3>No products found</h3>
          <p>Try a different category</p>
        </div>`;
      return;
    }
    grid.innerHTML = products.map((p, i) => `
      <div class="product-card" style="animation-delay:${i * 0.04}s">
        <div class="card-image-wrap">
          <img src="${p.image_url}" alt="${p.name}" loading="lazy"
               onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'">
          <span class="card-category-tag">${p.category}</span>
        </div>
        <div class="card-body">
          <div class="card-name">${p.name}</div>
          <div class="card-unit"><i class="fa-regular fa-clock"></i> ${p.unit || '1 unit'}</div>
          <div class="card-footer">
            <div class="card-price">₹${parseFloat(p.price).toFixed(2)} <span>/ ${p.unit || 'unit'}</span></div>
            <button class="add-btn" id="add-btn-${p.id}" onclick="addToCart(${p.id}, '${p.name}', this)">
              <i class="fa-solid fa-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render category filter buttons
  function renderCategories(categories) {
    const container = document.getElementById('category-filters');
    container.innerHTML = categories.map(cat => `
      <button class="filter-btn ${cat === activeCategory ? 'active' : ''}"
              onclick="filterByCategory('${cat}')">
        ${getCategoryEmoji(cat)} ${cat}
      </button>
    `).join('');
  }

  function getCategoryEmoji(cat) {
    const map = { All:'🛒', Fruits:'🍎', Vegetables:'🥦', Dairy:'🥛', Bakery:'🍞', Grains:'🌾', Beverages:'🧃' };
    return map[cat] || '🛍️';
  }

  // Filter by category
  window.filterByCategory = function(category) {
    activeCategory = category;
    renderCategories(allCategories);
    fetchProducts(category);
  };

  // Fetch products from API
  async function fetchProducts(category = 'All') {
    showSkeletons();
    try {
      const url = category === 'All' ? `${API}/products` : `${API}/products?category=${encodeURIComponent(category)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Server error');
      const products = await res.json();
      renderProducts(products);
    } catch (err) {
      document.getElementById('products-grid').innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon">⚠️</div>
          <h3>Connection Error</h3>
          <p>Make sure the backend server is running on port 3000</p>
        </div>`;
    }
  }

  // Fetch categories
  async function fetchCategories() {
    try {
      const res = await fetch(`${API}/products/categories`);
      allCategories = await res.json();
      renderCategories(allCategories);
    } catch {
      allCategories = ['All'];
      renderCategories(allCategories);
    }
  }

  // Add to cart
  window.addToCart = async function(productId, productName, btn) {
    btn.disabled = true;
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    try {
      const res = await fetch(`${API}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      });
      if (!res.ok) throw new Error();
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
      btn.classList.add('added');
      showToast(`${productName} added to cart! 🛒`);
      updateCartCount();
      setTimeout(() => {
        btn.innerHTML = original;
        btn.classList.remove('added');
        btn.disabled = false;
      }, 1500);
    } catch {
      btn.innerHTML = original;
      btn.disabled = false;
      showToast('Failed to add item. Is the server running?', 'error');
    }
  };

  // Init
  fetchCategories();
  fetchProducts();
  updateCartCount();
}

/* ============================================================
   CART PAGE
   ============================================================ */
if (document.getElementById('cart-items-container')) {

  async function fetchCart() {
    const container = document.getElementById('cart-items-container');
    const summarySection = document.getElementById('cart-summary-section');
    container.innerHTML = `<div class="loading-state"><div class="loading-spinner"></div><p>Loading your cart...</p></div>`;

    try {
      const res = await fetch(`${API}/cart`);
      const items = await res.json();

      updateCartCount();

      if (!items.length) {
        container.innerHTML = `
          <div class="cart-empty">
            <div class="cart-empty-icon">🛒</div>
            <h2>Your basket is empty!</h2>
            <p>Add some fresh groceries from our store</p>
            <a href="/" class="shop-now-btn"><i class="fa-solid fa-store"></i> Shop Now</a>
          </div>`;
        if (summarySection) summarySection.style.display = 'none';
        return;
      }

      if (summarySection) summarySection.style.display = '';
      renderCartItems(items);
      renderSummary(items);
    } catch {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚠️</div>
          <h3>Connection Error</h3>
          <p>Make sure the backend server is running on port 3000</p>
        </div>`;
    }
  }

  function renderCartItems(items) {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = items.map((item, i) => `
      <div class="cart-item" id="cart-item-${item.id}" style="animation-delay:${i * 0.06}s">
        <img class="cart-item-image" 
             src="${item.image_url}" 
             alt="${item.name}"
             onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${parseFloat(item.price).toFixed(2)} each</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, ${item.quantity - 1})">
            <i class="fa-solid fa-minus"></i>
          </button>
          <span class="qty-value" id="qty-${item.id}">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, ${item.quantity + 1})">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
        <div class="cart-item-subtotal" id="sub-${item.id}">
          ₹${parseFloat(item.subtotal).toFixed(2)}
        </div>
        <button class="remove-btn" onclick="removeItem(${item.id}, '${item.name}')">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `).join('');
  }

  function renderSummary(items) {
    const subtotal = items.reduce((sum, i) => sum + parseFloat(i.subtotal), 0);
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const discount = subtotal > 500 ? 20 : 0;
    const total = subtotal + deliveryFee - discount;
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

    document.getElementById('summary-items').textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
    document.getElementById('summary-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('summary-delivery').textContent = deliveryFee === 0 ? 'FREE 🎉' : `₹${deliveryFee.toFixed(2)}`;
    document.getElementById('summary-discount').textContent = discount > 0 ? `-₹${discount.toFixed(2)}` : '—';
    document.getElementById('summary-total').textContent = `₹${total.toFixed(2)}`;

    if (subtotal > 500) {
      document.getElementById('free-delivery-note').style.display = 'flex';
    }
  }

  // Change quantity
  window.changeQty = async function(cartId, newQty) {
    if (newQty < 1) {
      removeItem(cartId);
      return;
    }
    try {
      const res = await fetch(`${API}/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });
      if (!res.ok) throw new Error();
      fetchCart(); // re-render with updated totals
    } catch {
      showToast('Failed to update quantity', 'error');
    }
  };

  // Remove item
  window.removeItem = async function(cartId, name = 'Item') {
    const el = document.getElementById(`cart-item-${cartId}`);
    if (el) {
      el.style.opacity = '0.4';
      el.style.transform = 'scale(0.96)';
      el.style.transition = '0.2s ease';
    }
    try {
      const res = await fetch(`${API}/cart/${cartId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast(`${name} removed from cart`);
      fetchCart();
    } catch {
      if (el) { el.style.opacity = ''; el.style.transform = ''; }
      showToast('Failed to remove item', 'error');
    }
  };

  // Clear entire cart
  window.clearCart = async function() {
    if (!confirm('Clear all items from cart?')) return;
    try {
      await fetch(`${API}/cart`, { method: 'DELETE' });
      showToast('Cart cleared');
      fetchCart();
    } catch {
      showToast('Failed to clear cart', 'error');
    }
  };

  // Fake checkout
  window.checkout = function() {
    showToast('🎉 Order placed successfully! Thank you!');
    setTimeout(() => {
      fetch(`${API}/cart`, { method: 'DELETE' }).then(() => fetchCart());
    }, 1500);
  };

  // Init
  fetchCart();
  updateCartCount();
}
