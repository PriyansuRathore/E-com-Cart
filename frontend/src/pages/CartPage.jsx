import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCart, removeCartItem, updateCartQuantity, checkout } from '../api';
import CheckoutModal from '../components/CheckoutModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function loadCart() {
    try {
      setLoading(true);
      const c = await fetchCart();
      setCart(c);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function handleRemove(cartItemId) {
    try {
      await removeCartItem(cartItemId);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdateQuantity(cartItemId, newQty) {
    try {
      await updateCartQuantity(cartItemId, newQty);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCheckout(buyer) {
    try {
      const payload = await checkout(cart.items.map(i => ({ productId: i.productId, qty: i.qty })), buyer);
      setReceipt(payload.receipt);
      setShowCheckout(false);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <Navbar cartCount={cart.items.length} />
      
      <main className="main-content">
        <div className="container">
          <div className="cart-header">
            <h1 className="cart-title">
              🛒 Shopping Cart
            </h1>
            <Link to="/" className="back-btn">
              ← Continue Shopping
            </Link>
          </div>

          {error && <div className="error">{error}</div>}
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your cart...</p>
            </div>
          ) : (
            <div className="cart-content">
              {cart.items.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-icon">🛒</div>
                  <h2>Your cart is empty</h2>
                  <p>Looks like you haven't added anything to your cart yet</p>
                  <Link to="/" className="btn-primary">Start Shopping</Link>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.items.map(item => (
                      <div key={item.id} className="cart-item-card">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="cart-item-image"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                        <div className="cart-item-details">
                          <h3 className="item-name">{item.name}</h3>
                          <p className="item-price">₹{item.price}</p>
                        </div>
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, item.qty - 1)} 
                              disabled={item.qty <= 1}
                              className="qty-btn"
                            >
                              -
                            </button>
                            <span className="qty-display">{item.qty}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.id, item.qty + 1)}
                              className="qty-btn"
                            >
                              +
                            </button>
                          </div>
                          <div className="item-total">₹{(item.price * item.qty).toFixed(2)}</div>
                          <button 
                            onClick={() => handleRemove(item.id)} 
                            className="remove-btn"
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-summary-card">
                    <div className="summary-header">
                      <h3>Order Summary</h3>
                    </div>
                    <div className="summary-details">
                      <div className="summary-row">
                        <span>Items ({cart.items.length})</span>
                        <span>₹{cart.total.toFixed(2)}</span>
                      </div>
                      <div className="summary-row total-row">
                        <span>Total</span>
                        <span>₹{cart.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => user ? setShowCheckout(true) : navigate('/login')} 
                      className="btn-primary full-width"
                    >
                      💳 {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} onSubmit={handleCheckout} />}
      
      {receipt && (
        <>
          <div className="receipt-backdrop" onClick={() => setReceipt(null)} />
          <div className="receipt">
            <div className="receipt-header">
              <h3>🎉 Order Confirmed!</h3>
            </div>
            <div className="receipt-details">
              <div className="receipt-row">
                <span>Receipt ID:</span>
                <span>#{receipt.id}</span>
              </div>
              <div className="receipt-row">
                <span>Date & Time:</span>
                <span>{new Date(receipt.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="receipt-row">
                <span>Time:</span>
                <span>{new Date(receipt.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
            {receipt.items && (
              <div className="receipt-items">
                {receipt.items.map((item, index) => (
                  <div key={index} className="receipt-item">
                    <div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-qty">Qty: {item.qty}</div>
                    </div>
                    <div>₹{(item.price * item.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="receipt-row total">
              <span>Total Amount:</span>
              <span>₹{receipt.total}</span>
            </div>
            <button onClick={() => setReceipt(null)}>Close Receipt</button>
          </div>
        </>
      )}
    </div>
  );
}