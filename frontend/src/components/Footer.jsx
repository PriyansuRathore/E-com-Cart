import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">
            <span className="brand-icon">🛍️</span>
            VibeCart
          </h3>
          <p className="footer-desc">
            Modern e-commerce platform built with React, Node.js, and SQLite. 
            Showcasing full-stack development skills.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">📧</a>
            <a href="#" className="social-link">💼</a>
            <a href="#" className="social-link">🐙</a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="section-title">Quick Links</h4>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="section-title">Features</h4>
          <div className="footer-links">
            <span>🔍 Smart Search</span>
            <span>🛒 Cart Management</span>
            <span>🔐 User Authentication</span>
            <span>📊 Dashboard Analytics</span>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="section-title">Tech Stack</h4>
          <div className="tech-stack">
            <span className="tech-item">React 18</span>
            <span className="tech-item">Node.js</span>
            <span className="tech-item">Express</span>
            <span className="tech-item">SQLite</span>
            <span className="tech-item">JWT Auth</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; VibeCart. Built by <strong>Priyansu Rathore</strong></p>
          <p className="project-note">
            🚀 Full-Stack E-Commerce Platform
          </p>
        </div>
      </div>
    </footer>
  );
}