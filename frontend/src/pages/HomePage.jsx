import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchCart, addToCart } from '../api';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Products from '../components/Products';
import SearchFilters from '../components/SearchFilters';
import CategoryShowcase from '../components/CategoryShowcase';
import Footer from '../components/Footer';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');

  async function loadAll() {
    try {
      setLoading(true);
      setError(null);
      const [ps, c] = await Promise.all([fetchProducts(filters), fetchCart()]);
      setProducts(ps);
      setCart(c);
      
      // If no products found with filters, show appropriate message
      if (ps.length === 0 && (filters.category || filters.search || filters.minPrice || filters.maxPrice)) {
        // This is handled by the no-products state in render
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Server connection failed. Please check if the backend is running.');
      setProducts([]);
      setCart({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const newFilters = { ...filters, category: categoryId };
    setFilters(newFilters);
  };

  useEffect(() => {
    loadAll();
  }, [filters]);

  async function handleAdd(productId) {
    try {
      await addToCart(productId, 1);
      await loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <Navbar cartCount={cart.items.length} />
      
      <main className="main-content">
        <Hero />
        
        <section id="products" className="products-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">✨ Featured Products</h2>
              <p className="section-subtitle">Handpicked premium items crafted for the modern lifestyle. Quality meets innovation.</p>
            </div>
            
            <CategoryShowcase onCategorySelect={handleCategorySelect} />
            
            <SearchFilters 
              onFiltersChange={handleFiltersChange} 
              selectedCategory={selectedCategory}
            />
            
            {error && <div className="error">{error}</div>}
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading amazing products...</p>
              </div>
            ) : products.length === 0 && !error ? (
              <div className="no-products">
                <div className="no-products-icon">🛍️</div>
                <h3>No Products Found</h3>
                <p>We couldn't find any products matching your criteria.</p>
                <p>Try adjusting your filters or browse all categories.</p>
              </div>
            ) : (
              <Products products={products} onAdd={handleAdd} />
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}