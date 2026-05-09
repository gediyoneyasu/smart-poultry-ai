import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './CompanyAuth.css';

const API_URL = 'http://localhost:5001/api';

const CompanyAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Login attempt:', loginData.username);
    
    try {
      const response = await axios.post(`${API_URL}/auth/company-login`, {
        username: loginData.username,
        password: loginData.password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('poultryToken', response.data.token);
        localStorage.setItem('poultryUser', JSON.stringify(response.data.user));
        
        toast.success('Login successful! Redirecting to company dashboard...');
        
        setTimeout(() => {
          navigate('/company-dashboard');
        }, 1000);
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Invalid username or password');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (registerData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    console.log('Register attempt:', {
      name: registerData.name,
      email: registerData.email,
      companyName: registerData.companyName,
      username: registerData.username
    });
    
    try {
      const response = await axios.post(`${API_URL}/auth/company-register`, {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        companyName: registerData.companyName,
        username: registerData.username,
        password: registerData.password
      });
      
      console.log('Register response:', response.data);
      
      if (response.data.success) {
        localStorage.setItem('poultryToken', response.data.token);
        localStorage.setItem('poultryUser', JSON.stringify(response.data.user));
        
        toast.success('Company registered successfully! Redirecting to dashboard...');
        
        setTimeout(() => {
          navigate('/company-dashboard');
        }, 1000);
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Username or email may already exist.');
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
            <p>{isLogin ? 'Login with your credentials' : 'Create your company account'}</p>
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
          
          {isLogin ? (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Username or Email *</label>
                <input 
                  type="text" 
                  value={loginData.username} 
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})} 
                  placeholder="Enter your username or email"
                  required
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label>Password *</label>
                <input 
                  type="password" 
                  value={loginData.password} 
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button type="submit" className="company-auth-submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login to Company Portal'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  value={registerData.name} 
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})} 
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  value={registerData.email} 
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})} 
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={registerData.phone} 
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})} 
                  placeholder="Phone number"
                />
              </div>
              
              <div className="form-group">
                <label>Company Name *</label>
                <input 
                  type="text" 
                  value={registerData.companyName} 
                  onChange={(e) => setRegisterData({...registerData, companyName: e.target.value})} 
                  placeholder="Your company name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Username *</label>
                <input 
                  type="text" 
                  value={registerData.username} 
                  onChange={(e) => setRegisterData({...registerData, username: e.target.value})} 
                  placeholder="Choose a username"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Password *</label>
                <input 
                  type="password" 
                  value={registerData.password} 
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})} 
                  placeholder="At least 6 characters"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Confirm Password *</label>
                <input 
                  type="password" 
                  value={registerData.confirmPassword} 
                  onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})} 
                  placeholder="Confirm your password"
                  required
                />
              </div>
              
              <button type="submit" className="company-auth-submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Register Company'}
              </button>
            </form>
          )}
          
          <div className="company-auth-footer">
            <button onClick={() => navigate('/')} className="back-btn">
              ← Back to Home
            </button>
          </div>
          
          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Username: <strong>gediyon15</strong></p>
            <p>Password: <strong>123456</strong></p>
            <p style={{fontSize: '11px', color: '#666', marginTop: '10px'}}>
              New company? Click "Register" tab to create your company account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAuth;
