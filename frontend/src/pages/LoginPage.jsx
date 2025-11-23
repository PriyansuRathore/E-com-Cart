import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../api';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isForgotPassword) {
        // Mock forgot password - in real app, send email
        setMessage('Password reset instructions sent to your email!');
        setTimeout(() => {
          setIsForgotPassword(false);
          setMessage('');
        }, 3000);
        return;
      }

      let response;
      if (isLogin) {
        response = await login({ email: formData.email, password: formData.password });
      } else {
        response = await register(formData);
      }
      
      authLogin(response.token, response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <Link to="/" className="brand-link">
              <span className="brand-icon">🛍️</span>
              <span className="brand-text">VibeCart</span>
            </Link>
            <h1>{isForgotPassword ? '🔑 Reset Password' : (isLogin ? '🔐 Welcome Back' : '👤 Create Account')}</h1>
            <p>{isForgotPassword ? 'Enter your email to reset password' : (isLogin ? 'Sign in to your account' : 'Join our community today')}</p>
          </div>

          {error && <div className="error">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && !isForgotPassword && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            {!isForgotPassword && (
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            
            {isLogin && !isForgotPassword && (
              <div className="forgot-password">
                <button 
                  type="button" 
                  className="forgot-btn" 
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Password?
                </button>
              </div>
            )}
            
            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? '⏳ Processing...' : 
               isForgotPassword ? '📧 Send Reset Link' : 
               (isLogin ? '🔐 Sign In' : '👤 Create Account')}
            </button>
          </form>
          
          {!isForgotPassword && (
            <div className="login-switch">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                className="switch-btn" 
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          )}
          
          {isForgotPassword && (
            <div className="login-switch">
              <button 
                type="button" 
                className="switch-btn" 
                onClick={() => setIsForgotPassword(false)}
              >
                ← Back to Sign In
              </button>
            </div>
          )}

          <div className="login-footer">
            <Link to="/" className="back-home">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}