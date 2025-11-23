import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../api';

export default function SearchFilters({ onFiltersChange, selectedCategory = '' }) {
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: selectedCategory,
    minPrice: '',
    maxPrice: '',
    sort: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory !== filters.category) {
      const newFilters = { ...filters, category: selectedCategory };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    // Clean up numeric values
    if (key === 'minPrice' || key === 'maxPrice') {
      value = value === '' ? '' : parseFloat(value) || '';
    }
    
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="search-filters">
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>
      
      <div className="filters-row">
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
        />
        
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
        />
        
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
        
        <button 
          type="button" 
          onClick={clearFilters}
          className="clear-filters-btn"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
}