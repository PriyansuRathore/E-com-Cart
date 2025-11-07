const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function fetchProducts(){
  const res = await fetch(`${API_BASE}/products`);
  if(!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchCart(){
  const res = await fetch(`${API_BASE}/cart`);
  if(!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
}

export async function addToCart(productId, qty=1){
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ productId, qty })
  });
  if(!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Add to cart failed');
  }
  return res.json();
}

export async function updateCartQuantity(id, qty){
  const res = await fetch(`${API_BASE}/cart/${id}`, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ qty })
  });
  if(!res.ok) throw new Error('Update failed');
  return res.json();
}

export async function removeCartItem(id){
  const res = await fetch(`${API_BASE}/cart/${id}`, { method: 'DELETE' });
  if(!res.ok) throw new Error('Delete failed');
  return res.json();
}

export async function checkout(cartItems, buyer){
  const res = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ cartItems, ...buyer })
  });
  if(!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Checkout failed');
  }
  return res.json();
}
