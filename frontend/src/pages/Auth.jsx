import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const [language, setLanguage] = useState('en');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    farmName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
    
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard');
    }
  }, [navigate, isAuthenticated, authLoading]);

  const translations = {
    en: {
      login: "Login",
      register: "Register",
      welcomeBack: "Welcome Back!",
      loginSubtitle: "Login to access your poultry farm dashboard",
      createAccount: "Create Account",
      registerSubtitle: "Join Smart Poultry AI and start protecting your flock",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      name: "Full Name",
      farmName: "Farm Name",
      role: "I am a",
      farmer: "Farmer",
      vet: "Veterinarian",
      admin: "Admin",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      registerNow: "Register Now",
      loginNow: "Login Now",
      loggingIn: "Logging in...",
      registering: "Creating account...",
      fillAllFields: "Please fill all fields",
      passwordMismatch: "Passwords do not match",
      adminEmail: "admin@poultryai.com",
      adminPassword: "admin123",
      useAdmin: "Use Admin Account"
    },
    am: {
      login: "ግባ",
      register: "ተመዝገብ",
      welcomeBack: "እንኳን ደህና መጡ!",
      loginSubtitle: "ወደ ዶሮ እርሻ ዳሽቦርድዎ ለመግባት ይግቡ",
      createAccount: "አካውንት ፍጠር",
      registerSubtitle: "የስማርት ዶሮ ኤአይ ይቀላቀሉ እና መንጋዎን መጠበቅ ይጀምሩ",
      email: "ኢሜይል አድራሻ",
      password: "የይለፍ ቃል",
      confirmPassword: "የይለፍ ቃል አረጋግጥ",
      name: "ሙሉ ስም",
      farmName: "የእርሻ ስም",
      role: "እኔ የሆንኩት",
      farmer: "አርሶ አደር",
      vet: "የእንስሳት ሐኪም",
      admin: "አስተዳዳሪ",
      forgotPassword: "የይለፍ ቃል ረሳሁ?",
      noAccount: "አካውንት የለዎትም?",
      haveAccount: "አካውንት አለዎት?",
      registerNow: "አሁን ይመዝገቡ",
      loginNow: "አሁን ይግቡ",
      loggingIn: "በመግባት ላይ...",
      registering: "አካውንት በመፍጠር ላይ...",
      fillAllFields: "እባክዎ ሁሉንም መስኮች ይምላቸው",
      passwordMismatch: "የይለፍ ቃሎች አይዛመዱም",
      adminEmail: "admin@poultryai.com",
      adminPassword: "admin123",
      useAdmin: "የአስተዳዳሪ አካውንት ይጠቀሙ"
    }
  };

  const t = translations[language];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error(t.fillAllFields);
        setLoading(false);
        return;
      }
      
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error(t.fillAllFields);
        setLoading(false);
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error(t.passwordMismatch);
        setLoading(false);
        return;
      }
      
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: '',
        role: formData.role,
        farmName: formData.farmName
      });
      
      if (result.success) {
        navigate('/dashboard');
      }
    }
    setLoading(false);
  };

  const useAdminAccount = () => {
    setFormData({
      ...formData,
      email: 'admin@poultryai.com',
      password: 'admin123'
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">🐔</span>
              <span className="logo-text">Smart Poultry AI</span>
            </div>
            <h1>{isLogin ? t.login : t.register}</h1>
            <p>{isLogin ? t.loginSubtitle : t.registerSubtitle}</p>
          </div>

          <div className="auth-tabs">
            <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
              {t.login}
            </button>
            <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
              {t.register}
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="form-group">
                  <label>{t.name} *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" />
                  <i className="fas fa-user"></i>
                </div>
                <div className="form-group">
                  <label>{t.farmName}</label>
                  <input type="text" name="farmName" value={formData.farmName} onChange={handleChange} placeholder="Enter your farm name" />
                  <i className="fas fa-tractor"></i>
                </div>
                <div className="form-group">
                  <label>{t.role} *</label>
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="farmer">{t.farmer}</option>
                    <option value="vet">{t.vet}</option>
                    <option value="admin">{t.admin}</option>
                  </select>
                  <i className="fas fa-users"></i>
                </div>
              </>
            )}

            <div className="form-group">
              <label>{t.email} *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />
              <i className="fas fa-envelope"></i>
            </div>

            <div className="form-group">
              <label>{t.password} *</label>
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
              <i className="fas fa-lock"></i>
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
              </button>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>{t.confirmPassword} *</label>
                <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
                <i className="fas fa-check-circle"></i>
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <><i className="fas fa-spinner fa-spin"></i> {isLogin ? t.loggingIn : t.registering}</> : <><i className="fas fa-paper-plane"></i> {isLogin ? t.login : t.register}</>}
            </button>

            {isLogin && (
              <button type="button" className="demo-btn admin-demo" onClick={useAdminAccount}>
                <i className="fas fa-user-shield"></i> {t.useAdmin}
              </button>
            )}
          </form>

          <div className="auth-footer">
            {isLogin ? (
              <p>{t.noAccount} <button onClick={() => setIsLogin(false)}>{t.registerNow}</button></p>
            ) : (
              <p>{t.haveAccount} <button onClick={() => setIsLogin(true)}>{t.loginNow}</button></p>
            )}
          </div>
        </div>

        <div className="auth-bg">
          <div className="bg-content">
            <h2>🐔 AI-Powered Poultry Health Management</h2>
            <p>Detect diseases early • Predict outbreaks • Get smart recommendations • 24/7 AI Assistant</p>
            <div className="bg-features">
              <span><i className="fas fa-microscope"></i> AI Disease Detection</span>
              <span><i className="fas fa-chart-line"></i> Predictive Analytics</span>
              <span><i className="fas fa-robot"></i> Smart Chatbot</span>
              <span><i className="fas fa-chalkboard-teacher"></i> Learning System</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
