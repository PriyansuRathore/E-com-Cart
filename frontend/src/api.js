const API_BASE = import.meta.env.VITE_API_BASE || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:4000/api');

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Auth APIs
export async function register(userData) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Registration failed');
  }
  return res.json();
}

export async function login(credentials) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login failed');
  }
  return res.json();
}

export async function fetchProfile() {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

// Product APIs
export async function fetchProducts(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_BASE}/products?${params}`);
    if (!res.ok) {
      if (res.status === 404) {
        return []; // Return empty array for no products found
      }
      if (res.status === 500) {
        console.error('Database error - returning empty results');
        return []; // Return empty array for database errors
      }
      throw new Error(`Server error: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      // Network error - server might be down
      console.error('Server connection failed');
      return []; // Return empty array instead of throwing
    }
    throw err;
  }
}

export async function fetchProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) {
      if (res.status === 404) {
        return []; // Return empty array for no categories
      }
      if (res.status === 500) {
        console.error('Database error - returning default categories');
        return [
          { id: 'electronics', name: 'Electronics', description: 'Phones, Laptops, Gadgets' },
          { id: 'fashion', name: 'Fashion', description: 'Clothing, Shoes, Accessories' },
          { id: 'home', name: 'Home & Kitchen', description: 'Furniture, Appliances' },
          { id: 'books', name: 'Books', description: 'Fiction, Non-fiction, Educational' }
        ];
      }
      throw new Error(`Server error: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      // Network error - return default categories
      return [
        { id: 'electronics', name: 'Electronics', description: 'Phones, Laptops, Gadgets' },
        { id: 'fashion', name: 'Fashion', description: 'Clothing, Shoes, Accessories' },
        { id: 'home', name: 'Home & Kitchen', description: 'Furniture, Appliances' },
        { id: 'books', name: 'Books', description: 'Fiction, Non-fiction, Educational' }
      ];
    }
    throw err;
  }
}

// Cart APIs
export async function fetchCart() {
  try {
    const res = await fetch(`${API_BASE}/cart`);
    if (!res.ok) {
      if (res.status === 404) {
        return { items: [], total: 0 }; // Return empty cart
      }
      if (res.status === 500) {
        console.error('Database error - returning empty cart');
        return { items: [], total: 0 };
      }
      throw new Error(`Server error: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      // Network error - return empty cart
      return { items: [], total: 0 };
    }
    throw err;
  }
}

export async function addToCart(productId, qty = 1) {
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, qty })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Add to cart failed');
  }
  return res.json();
}

export async function updateCartQuantity(id, qty) {
  const res = await fetch(`${API_BASE}/cart/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qty })
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}

export async function removeCartItem(id) {
  const res = await fetch(`${API_BASE}/cart/${id}`, { 
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}

export async function checkout(cartItems, buyer) {
  const res = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ cartItems, ...buyer })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Checkout failed');
  }
  return res.json();
}