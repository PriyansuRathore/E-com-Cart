import React from 'react';

export default function Products({ products, onAdd }){
  return (
    <section className="products-grid">
      {products.map(p => (
        <div key={p.id} className="card">
          <div className="card-body">
            <h4>{p.name}</h4>
            <p>{p.description}</p>
            <div className="price">₹{p.price}</div>
            <button onClick={()=>onAdd(p.id)}>Add to cart</button>
          </div>
        </div>
      ))}
    </section>
  );
}
