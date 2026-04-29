import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const [language, setLanguage] = useState('en');
  const [showMenu, setShowMenu] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    setShowLangDropdown(false);
    window.location.reload(); // Reload to apply language changes
  };

  const toggleMenu = () => setShowMenu(!showMenu);
  const closeMenu = () => setShowMenu(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  const toggleLangDropdown = () => setShowLangDropdown(!showLangDropdown);

  const translations = {
    en: {
      home: 'Home',
      dashboard: 'Dashboard',
      diseases: 'Diseases',
      farm: 'Farm',
      reports: 'Reports',
      contact: 'Contact',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      aiAnalysis: 'AI Analysis',
      admin: 'Admin Panel'
    },
    am: {
      home: 'መነሻ',
      dashboard: 'ዳሽቦርድ',
      diseases: 'በሽታዎች',
      farm: 'እርሻ',
      reports: 'ሪፖርቶች',
      contact: 'አግኙን',
      profile: 'መገለጫ',
      logout: 'ውጣ',
      login: 'ግባ',
      aiAnalysis: 'ኤአይ ትንተና',
      admin: 'አስተዳዳሪ ፓነል'
    }
  };

  const t = translations[language];

  return (
    <header className="poultry-nav-wrapper">
      <div className="poultry-nav-logo">
        <Link to="/">
          <span className="logo-icon">🐔</span>
          <span className="logo-text">Ged_AI Poultry</span>
        </Link>
      </div>

      <ul className={showMenu ? "showNav" : ""} onClick={closeMenu}>
        <li><Link to="/">{t.home}</Link></li>
        <li><Link to="/dashboard">{t.dashboard}</Link></li>
        <li><Link to="/diseases">{t.diseases}</Link></li>
        <li><Link to="/farm">{t.farm}</Link></li>
        <li><Link to="/reports">{t.reports}</Link></li>
        <li><Link to="/contact">{t.contact}</Link></li>
        {isAuthenticated && user?.role === 'admin' && (
          <li><Link to="/admin" className="admin-nav-link">{t.admin}</Link></li>
        )}
        {isAuthenticated && (
          <li><button onClick={handleLogout} className="mobile-logout">{t.logout}</button></li>
        )}
      </ul>

      <div className="poultry-nav-buttons">
        <div className="language-dropdown">
          <button className="lang-btn" onClick={toggleLangDropdown}>
            <span>{language === 'en' ? 'EN' : 'አማ'}</span>
            <i className="fas fa-chevron-down"></i>
          </button>
          {showLangDropdown && (
            <div className="lang-dropdown-menu">
              <button className={`lang-option ${language === 'en' ? 'active' : ''}`} onClick={() => changeLanguage('en')}>English (EN)</button>
              <button className={`lang-option ${language === 'am' ? 'active' : ''}`} onClick={() => changeLanguage('am')}>አማርኛ (AM)</button>
            </div>
          )}
        </div>

        <Link to="/analyze" className="ai-analysis-btn">
          <i className="fas fa-microscope"></i>
          <span>{t.aiAnalysis}</span>
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="nav-profile-icon"><i className="fas fa-user"></i></Link>
            <div className="user-menu">
              <Link to="/profile" className="user-btn"><i className="fas fa-user"></i><span>{user?.name?.split(' ')[0] || 'User'}</span></Link>
              <button type="button" onClick={handleLogout} className="logout-icon"><i className="fas fa-sign-out-alt"></i></button>
            </div>
          </>
        ) : (
          <Link to="/auth" className="auth-btn"><i className="fas fa-user"></i><span>{t.login}</span></Link>
        )}
        
        <i className="fas fa-bars" id="poultry-menu-bar" onClick={toggleMenu}></i>
      </div>
    </header>
  );
}

export default Header;
