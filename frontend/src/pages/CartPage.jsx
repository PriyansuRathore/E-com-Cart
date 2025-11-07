import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCart, removeCartItem, updateCartQuantity, checkout } from '../api';
import CheckoutModal from '../components/CheckoutModal';

export default function CartPage() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);

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
    <div className="container">
      <header className="header">
        <h1>Shopping Cart</h1>
        <Link to="/" className="back-btn">← Back to Products</Link>
      </header>

      {error && <div className="error">{error}</div>}
      
      {loading ? (
        <div>Loading cart...</div>
      ) : (
        <div className="cart-page">
          {cart.items.length === 0 ? (
            <div className="empty-cart">
              <h2>Your cart is empty</h2>
              <Link to="/" className="continue-shopping">Continue Shopping</Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map(item => (
                  <div key={item.id} className="cart-item-row">
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p>₹{item.price}</p>
                    </div>
                    <div className="quantity-controls">
                      <button onClick={() => handleUpdateQuantity(item.id, item.qty - 1)} disabled={item.qty <= 1}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.qty + 1)}>+</button>
                    </div>
                    <div className="item-total">₹{(item.price * item.qty).toFixed(2)}</div>
                    <button onClick={() => handleRemove(item.id)} className="remove-btn">Remove</button>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="total">Total: ₹{cart.total.toFixed(2)}</div>
                <button onClick={() => setShowCheckout(true)} className="checkout-btn">Proceed to Checkout</button>
              </div>
            </>
          )}
        </div>
      )}

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