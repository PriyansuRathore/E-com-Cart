import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../api';

export default function CategoryShowcase({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleCategoryClick = (categoryId) => {
    const newCategory = selectedCategory === categoryId ? '' : categoryId;
    setSelectedCategory(newCategory);
    onCategorySelect(newCategory);
  };

  const categoryIcons = {
    electronics: '📱',
    fashion: '👕',
    home: '🏠',
    books: '📚'
  };

  return (
    <div className="category-showcase">
      <h3 className="category-title">Shop by Category</h3>
      <div className="category-grid">
        <div 
          className={`category-card ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => handleCategoryClick('')}
        >
          <div className="category-icon">🛍️</div>
          <div className="category-name">All Products</div>
        </div>
        {categories.map(category => (
          <div 
            key={category.id}
            className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="category-icon">
              {categoryIcons[category.id] || '📦'}
            </div>
            <div className="category-name">{category.name}</div>
            <div className="category-desc">{category.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}