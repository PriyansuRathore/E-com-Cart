import React from 'react';

export default function Cart({ items, total, onRemove, onUpdateQuantity }){
  return (
    <aside className="cart">
      <h3>Cart</h3>
      {items.length === 0 ? <div>Cart is empty</div> :
        <ul>
          {items.map(it => (
            <li key={it.id}>
              <div className="cart-item">
                <div>{it.name}</div>
                <div className="quantity-controls">
                  <button onClick={()=>onUpdateQuantity(it.id, it.qty - 1)} disabled={it.qty <= 1}>-</button>
                  <span>{it.qty}</span>
                  <button onClick={()=>onUpdateQuantity(it.id, it.qty + 1)}>+</button>
                </div>
                <div>₹{(it.price*it.qty).toFixed(2)}</div>
                <button onClick={()=>onRemove(it.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      }
      <div className="cart-total">Total: ₹{total.toFixed(2)}</div>
    </aside>
  );
}
