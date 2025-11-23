import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">VibeCart</span>
          </h1>
          <p className="hero-subtitle">
            Your ultimate shopping destination with modern design and seamless experience
          </p>
          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Fast & Secure</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎯</span>
              <span>Smart Search</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💳</span>
              <span>Easy Checkout</span>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="#products" className="btn-primary">
              🛍️ Start Shopping
            </Link>
            {!isAuthenticated && (
              <Link to="/dashboard" className="btn-secondary">
                📊 View Dashboard
              </Link>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="card-header">
              <div className="card-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="card-content">
              <div className="mock-product">
                <div className="mock-image"></div>
                <div className="mock-text">
                  <div className="mock-line"></div>
                  <div className="mock-line short"></div>
                </div>
              </div>
              <div className="mock-buttons">
                <div className="mock-btn primary"></div>
                <div className="mock-btn secondary"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}