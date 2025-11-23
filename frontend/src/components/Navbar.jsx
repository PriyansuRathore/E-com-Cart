import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar({ cartCount = 0 }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            <span className="brand-icon">🛍️</span>
            <span className="brand-text">VibeCart</span>
          </Link>

          <div className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <span className="nav-icon">🏠</span>
              Home
            </Link>
            
            {isAuthenticated && (
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                <span className="nav-icon">📊</span>
                Dashboard
              </Link>
            )}
            
            <Link to="/cart" className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`}>
              <span className="nav-icon">🛒</span>
              Cart
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>

          <div className="nav-actions">
            {isAuthenticated ? (
              <div className="user-dropdown">
                <button 
                  className="user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="user-avatar">👤</span>
                  <span className="user-name">{user?.name || user?.email}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {showUserMenu && (
                  <div className="dropdown-menu">
                    <Link to="/dashboard" className="dropdown-item">
                      📊 Dashboard
                    </Link>
                    <button onClick={logout} className="dropdown-item logout">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                🔐 Login
              </Link>
            )}
          </div>
        </div>
      </nav>


    </>
  );
}