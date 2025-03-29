// src/components/Login.js
import React, { useState } from 'react';
import '../styles/DashboardStyles.css';

// Enhanced Login component with curvy design elements
const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    // Clear any error when user types
    if (error) setError('');
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes - in a real app, you'd check against your backend
      if (credentials.username === 'admin' && credentials.password === 'password') {
        // Save to localStorage if "Remember me" is checked
        if (rememberMe) {
          localStorage.setItem('rememberedUser', credentials.username);
        } else {
          localStorage.removeItem('rememberedUser');
        }
        
        // Call the onLogin callback (would typically set auth state in a real app)
        if (onLogin) onLogin(credentials.username);
      } else {
        setError('Invalid username or password');
      }
    }, 1500);
  };

  return (
    <div className={`login-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="login-content-wrapper">
        {/* Left column: Login Form */}
        <div className="login-form-column">
          <div className="login-logo-container">
            <img src="/assets/ACD Logo.png" alt="ACD Logo" className="logo" />
            <h2 className="app-name">Smart Inventory Management System</h2>
          </div>
          
          <div className="login-card">
            <div className="login-card-header">
              <h2>Welcome Back</h2>
              <p>Please sign in to continue</p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="login-error">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="login-form">
              {/* Username Field */}
              <div className="form-group">
                <label htmlFor="username">
                  <i className="fas fa-user"></i>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  autoComplete="username"
                  className={error && !credentials.username ? 'input-error' : ''}
                />
              </div>
              
              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">
                  <i className="fas fa-lock"></i>
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={error && !credentials.password ? 'input-error' : ''}
                  />
                  <span 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
                </div>
              </div>
              
              {/* Remember Me & Forgot Password */}
              <div className="login-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="rememberMe">Remember me</label>
                </div>
                <a href="#forgot-password" className="forgot-password">
                  Forgot Password?
                </a>
              </div>
              
              {/* Login Button */}
              <button 
                type="submit" 
                className={`login-btn ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Login
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Theme Toggle */}
          <div className="login-theme-toggle">
            <button onClick={toggleDarkMode} className="theme-toggle-btn">
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
        
        {/* Right column: Image with enhanced effects */}
        <div className="login-image-column">
          <div className="light-effect"></div>
          <img 
            src="/assets/crawler.png" 
            alt="Construction Equipment" 
            className="login-background-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;