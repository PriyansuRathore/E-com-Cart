import React, { useState } from 'react';

export default function CheckoutModal({ onClose, onSubmit }){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try{
      await onSubmit({ name, email });
    }catch(e){
      // onSubmit handles errors/sets global errors
    } finally { setSubmitting(false); onClose(); }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>🛒 Checkout</h3>
        <form onSubmit={handle}>
          <label htmlFor="name">Full Name</label>
          <input 
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name} 
            onChange={e=>setName(e.target.value)} 
            required 
          />
          <label htmlFor="email">Email Address</label>
          <input 
            id="email"
            type="email" 
            placeholder="Enter your email address"
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required 
          />
          <div className="modal-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? '💳 Processing...' : '💳 Complete Order'}
            </button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
