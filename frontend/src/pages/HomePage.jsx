import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCart, addToCart } from '../api';
import Products from '../components/Products';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadAll() {
    try {
      setLoading(true);
      const [ps, c] = await Promise.all([fetchProducts(), fetchCart()]);
      setProducts(ps);
      setCart(c);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleAdd(productId) {
    try {
      await addToCart(productId, 1);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Vibe Commerce — Mock Cart</h1>
        <Link to="/cart" className="checkout-btn">
          View Cart ({cart.items.length})
        </Link>
      </header>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Products products={products} onAdd={handleAdd} />
      )}

      <footer className="footer">Built for Vibe Commerce screening</footer>
    </div>
  );
}