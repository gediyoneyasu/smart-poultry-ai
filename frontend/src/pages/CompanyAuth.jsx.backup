import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './CompanyAuth.css';

const API_URL = 'http://localhost:5001/api';

const CompanyAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Check if already logged in as company admin
  useEffect(() => {
    const token = localStorage.getItem('poultryToken');
    const user = JSON.parse(localStorage.getItem('poultryUser') || '{}');
    if (token && user.role === 'company_admin') {
      navigate('/farm');
    }
  }, [navigate]);

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!registerForm.name || !registerForm.email || !registerForm.companyName || 
        !registerForm.username || !registerForm.password) {
      toast.error('Please fill all required fields');
      setLoading(false);
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      console.log('Registering company:', {
        name: registerForm.name,
        email: registerForm.email,
        companyName: registerForm.companyName,
        username: registerForm.username
      });

      const response = await axios.post(`${API_URL}/auth/company-register`, {
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone,
        companyName: registerForm.companyName,
        username: registerForm.username,
        password: registerForm.password,
        role: 'company_admin'
      });

      console.log('Registration response:', response.data);

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('poultryToken', response.data.token);
        localStorage.setItem('poultryUser', JSON.stringify(response.data.user));
        
        toast.success('Company account created successfully!');
        
        // Small delay to ensure storage is complete
        setTimeout(() => {
          navigate('/farm');
        }, 500);
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!loginForm.username || !loginForm.password) {
      toast.error('Please enter username and password');
      setLoading(false);
      return;
    }

    try {
      console.log('Logging in with username:', loginForm.username);

      const response = await axios.post(`${API_URL}/auth/company-login`, {
        username: loginForm.username,
        password: loginForm.password
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('poultryToken', response.data.token);
        localStorage.setItem('poultryUser', JSON.stringify(response.data.user));
        
        toast.success(`Welcome back, ${response.data.user.name}!`);
        
        // Small delay to ensure storage is complete
        setTimeout(() => {
          navigate('/farm');
        }, 500);
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="company-auth-page">
      <div className="company-auth-container">
        <div className="company-auth-card">
          <div className="company-auth-header">
            <div className="company-auth-logo">
              <span className="logo-icon">🏢</span>
              <span className="logo-text">Company Portal</span>
            </div>
            <h1>{isLogin ? 'Company Login' : 'Register Company'}</h1>
            <p>{isLogin ? 'Login with your username' : 'Create your company account'}</p>
          </div>

          <div className="company-auth-tabs">
            <button 
              className={`company-auth-tab ${isLogin ? 'active' : ''}`} 
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={`company-auth-tab ${!isLogin ? 'active' : ''}`} 
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {isLogin && (
            <form className="company-auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label>Username *</label>
                <input 
                  type="text" 
                  name="username" 
                  value={loginForm.username} 
                  onChange={handleLoginChange} 
                  placeholder="Enter your username" 
                  autoComplete="username"
                />
                <i className="fas fa-user-circle"></i>
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={loginForm.password} 
                  onChange={handleLoginChange} 
                  placeholder="••••••••" 
                  autoComplete="current-password"
                />
                <i className="fas fa-lock"></i>
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>

              <button type="submit" className="company-auth-submit" disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Logging in...</> : <><i className="fas fa-sign-in-alt"></i> Login</>}
              </button>
            </form>
          )}

          {!isLogin && (
            <form className="company-auth-form" onSubmit={handleRegister}>
              <div className="form-row">
                <div className="form-group half">
                  <label>Full Name *</label>
                  <input type="text" name="name" value={registerForm.name} onChange={handleRegisterChange} placeholder="Your full name" />
                  <i className="fas fa-user"></i>
                </div>
                <div className="form-group half">
                  <label>Email *</label>
                  <input type="email" name="email" value={registerForm.email} onChange={handleRegisterChange} placeholder="your@email.com" />
                  <i className="fas fa-envelope"></i>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" value={registerForm.phone} onChange={handleRegisterChange} placeholder="Phone number" />
                  <i className="fas fa-phone"></i>
                </div>
                <div className="form-group half">
                  <label>Company Name *</label>
                  <input type="text" name="companyName" value={registerForm.companyName} onChange={handleRegisterChange} placeholder="Your company name" />
                  <i className="fas fa-building"></i>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Username *</label>
                  <input type="text" name="username" value={registerForm.username} onChange={handleRegisterChange} placeholder="Choose a username" />
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="form-group half">
                  <label>Password *</label>
                  <input type={showPassword ? "text" : "password"} name="password" value={registerForm.password} onChange={handleRegisterChange} placeholder="••••••••" />
                  <i className="fas fa-lock"></i>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <input type={showPassword ? "text" : "password"} name="confirmPassword" value={registerForm.confirmPassword} onChange={handleRegisterChange} placeholder="••••••••" />
                <i className="fas fa-check-circle"></i>
              </div>

              <button type="submit" className="company-auth-submit" disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Creating account...</> : <><i className="fas fa-building"></i> Register Company</>}
              </button>
            </form>
          )}

          <div className="company-auth-footer">
            {isLogin ? (
              <p>
                Don't have a company account? <button onClick={() => setIsLogin(false)}>Register Now</button>
              </p>
            ) : (
              <p>
                Already have a company account? <button onClick={() => setIsLogin(true)}>Login Now</button>
              </p>
            )}
          </div>

          <div className="company-auth-back">
            <button onClick={() => navigate('/')} className="back-btn">
              ← Back to Home
            </button>
          </div>
        </div>

        <div className="company-auth-bg">
          <div className="bg-content">
            <h2>🏢 Company Management Portal</h2>
            <p>Manage multiple farms • Add employees • Track analytics</p>
            <div className="bg-features">
              <span><i className="fas fa-chart-line"></i> Company Analytics</span>
              <span><i className="fas fa-users"></i> Employee Management</span>
              <span><i className="fas fa-tractor"></i> Multi-Farm Management</span>
              <span><i className="fas fa-file-alt"></i> Consolidated Reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAuth;