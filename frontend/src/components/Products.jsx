import React from 'react';

export default function Products({ products, onAdd }){
  return (
    <section className="products-grid">
      {products.map(p => (
        <div key={p.id} className="card">
          {p.image && (
            <img 
              src={p.image} 
              alt={p.name} 
              className="product-image"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <div className="card-body">
            <h4>{p.name}</h4>
            <p>{p.description}</p>
            <div className="price">₹{p.price}</div>
            {p.rating && (
              <div className="rating">
                {'⭐'.repeat(Math.floor(p.rating))} {p.rating}
              </div>
            )}
            {p.stock && (
              <div className="stock">Stock: {p.stock}</div>
            )}
            <button onClick={()=>onAdd(p.id)}>Add to cart</button>
          </div>
        </div>
      ))}
    </section>
  );
}
