import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchProfile, fetchCart } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      const [profileData, cartData] = await Promise.all([
        fetchProfile(),
        fetchCart()
      ]);
      setProfile(profileData);
      setCart(cartData);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <Navbar cartCount={0} />
        <main className="main-content">
          <div className="container">
            <div className="auth-required">
              <div className="auth-card">
                <h2>🔐 Authentication Required</h2>
                <p>Please log in to access your personal dashboard and manage your account.</p>
                <Link to="/" className="btn-primary">🏠 Go to Home</Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar cartCount={cart.items.length} />
      
      <main className="main-content">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">
              📊 Welcome back, {profile?.name || 'User'}!
            </h1>
            <p className="dashboard-subtitle">
              Here's your personalized dashboard with all your account details
            </p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your dashboard...</p>
            </div>
          ) : (
            <div className="dashboard-grid">
              <div className="dashboard-card profile-card">
                <div className="card-header">
                  <h3>👤 Profile Information</h3>
                  <span className="card-badge">Verified</span>
                </div>
                <div className="profile-info">
                  <div className="profile-item">
                    <span className="profile-label">Full Name</span>
                    <span className="profile-value">{profile?.name}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">Email Address</span>
                    <span className="profile-value">{profile?.email}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">Phone Number</span>
                    <span className="profile-value">{profile?.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="dashboard-card cart-card">
                <div className="card-header">
                  <h3>🛒 Shopping Cart</h3>
                  <span className="cart-count">{cart.items.length}</span>
                </div>
                <div className="cart-summary">
                  <div className="summary-item">
                    <span className="summary-label">Total Items</span>
                    <span className="summary-value">{cart.items.length}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Cart Value</span>
                    <span className="summary-value">₹{cart.total.toFixed(2)}</span>
                  </div>
                  <Link to="/cart" className="btn-primary full-width">
                    🛒 Manage Cart
                  </Link>
                </div>
              </div>

              <div className="dashboard-card actions-card">
                <div className="card-header">
                  <h3>🚀 Quick Actions</h3>
                </div>
                <div className="quick-actions">
                  <Link to="/" className="action-btn">
                    <span className="action-icon">🛑</span>
                    <span>Browse Products</span>
                  </Link>
                  <Link to="/cart" className="action-btn">
                    <span className="action-icon">📋</span>
                    <span>Manage Cart</span>
                  </Link>
                </div>
              </div>

              <div className="dashboard-card stats-card">
                <div className="card-header">
                  <h3>📈 Analytics</h3>
                </div>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-content">
                      <span className="stat-number">{cart.items.length}</span>
                      <span className="stat-label">Items in Cart</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                      <span className="stat-number">₹{cart.total.toFixed(0)}</span>
                      <span className="stat-label">Total Value</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}