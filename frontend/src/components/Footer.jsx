import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [language, setLanguage] = useState('en');
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
  }, []);

  const translations = {
    en: {
      tagline: "AI-Powered Poultry Health Management",
      about: "About Us",
      aboutText: "Smart Poultry AI helps farmers detect diseases early, predict outbreaks, and maximize productivity using artificial intelligence.",
      quickLinks: "Quick Links",
      home: "Home",
      dashboard: "Dashboard",
      diseases: "Diseases",
      farm: "Farm",
      reports: "Reports",
      contact: "Contact",
      ourServices: "Our Services",
      aiDetection: "AI Disease Detection",
      outbreakPrediction: "Outbreak Prediction",
      smartAssistant: "Smart Assistant",
      farmAnalytics: "Farm Analytics",
      contactInfo: "Contact Info",
      address: "Bishoftu, Oromia, Ethiopia",
      phone: "+251 911 234 567",
      email: "info@smartpoultryai.com",
      workingHours: "Mon - Fri: 8:00 AM - 6:00 PM",
      followUs: "Follow Us",
      newsletter: "Newsletter",
      newsletterText: "Subscribe to get updates on new features and poultry health tips.",
      subscribe: "Subscribe",
      yourEmail: "Your email address",
      rights: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      support: "Support"
    },
    am: {
      tagline: "በኤአይ የሚመራ የዶሮ ጤና አስተዳደር",
      about: "ስለእኛ",
      aboutText: "ስማርት ፑልትሪ ኤአይ አርሶ አደሮች በሽታዎችን ቀድመው እንዲለዩ፣ ወረርሽኞችን እንዲተነብዩ እና ምርታማነታቸውን እንዲያሳድጉ ይረዳል።",
      quickLinks: "ፈጣን አገናኞች",
      home: "መነሻ",
      dashboard: "ዳሽቦርድ",
      diseases: "በሽታዎች",
      farm: "እርሻ",
      reports: "ሪፖርቶች",
      contact: "አግኙን",
      ourServices: "አገልግሎቶቻችን",
      aiDetection: "ኤአይ በሽታ መለየት",
      outbreakPrediction: "ወረርሽኝ ትንበያ",
      smartAssistant: "ስማርት ረዳት",
      farmAnalytics: "የእርሻ ትንተና",
      contactInfo: "የመገናኛ መረጃ",
      address: "ቢሾፍቱ፣ ኦሮሚያ፣ ኢትዮጵያ",
      phone: "+251 911 234 567",
      email: "info@smartpoultryai.com",
      workingHours: "ሰኞ - አርብ: 8:00 ጠዋት - 6:00 ማታ",
      followUs: "ይከተሉን",
      newsletter: "ጋዜጣ",
      newsletterText: "አዳዲስ ባህሪያት እና የዶሮ ጤና ምክሮች ለማግኘት ይመዝገቡ።",
      subscribe: "ይመዝገቡ",
      yourEmail: "ኢሜይል አድራሻዎ",
      rights: "መብቱ በህግ የተጠበቀ ነው።",
      privacy: "የግላዊነት ፖሊሲ",
      terms: "የአገልግሎት ውሎች",
      support: "ድጋፍ"
    }
  };

  const t = translations[language];
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="smart-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🐔</span>
              <span className="logo-text">Smart Poultry AI</span>
            </div>
            <p className="footer-tagline">{t.tagline}</p>
            <p className="footer-description">{t.aboutText}</p>
            <div className="social-links">
              <a href="#" className="social-icon facebook" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon twitter" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon instagram" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon linkedin" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="social-icon telegram" aria-label="Telegram">
                <i className="fab fa-telegram-plane"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>{t.quickLinks}</h3>
            <ul className="footer-links">
              <li><Link to="/"><i className="fas fa-home"></i> {t.home}</Link></li>
              <li><Link to="/dashboard"><i className="fas fa-chart-line"></i> {t.dashboard}</Link></li>
              <li><Link to="/diseases"><i className="fas fa-virus"></i> {t.diseases}</Link></li>
              <li><Link to="/farm"><i className="fas fa-tractor"></i> {t.farm}</Link></li>
              <li><Link to="/reports"><i className="fas fa-file-alt"></i> {t.reports}</Link></li>
              <li><Link to="/contact"><i className="fas fa-envelope"></i> {t.contact}</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="footer-section">
            <h3>{t.ourServices}</h3>
            <ul className="footer-links">
              <li><i className="fas fa-microscope"></i> {t.aiDetection}</li>
              <li><i className="fas fa-chart-line"></i> {t.outbreakPrediction}</li>
              <li><i className="fas fa-robot"></i> {t.smartAssistant}</li>
              <li><i className="fas fa-chart-pie"></i> {t.farmAnalytics}</li>
              <li><i className="fas fa-headset"></i> {t.support}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3>{t.contactInfo}</h3>
            <ul className="footer-contact">
              <li>
                <i className="fas fa-map-marker-alt"></i>
                <span>{t.address}</span>
              </li>
              <li>
                <i className="fas fa-phone-alt"></i>
                <a href="tel:+251911234567">{t.phone}</a>
              </li>
              <li>
                <i className="fas fa-envelope"></i>
                <a href="mailto:info@smartpoultryai.com">{t.email}</a>
              </li>
              <li>
                <i className="fas fa-clock"></i>
                <span>{t.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <i className="fas fa-envelope-open-text"></i>
              <div>
                <h3>{t.newsletter}</h3>
                <p>{t.newsletterText}</p>
              </div>
            </div>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="input-group">
                <input 
                  type="email" 
                  placeholder={t.yourEmail} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">
                  {subscribed ? <i className="fas fa-check"></i> : t.subscribe}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="bottom-content">
            <p>&copy; {year} Smart Poultry AI. {t.rights}</p>
            <div className="bottom-links">
              <Link to="/privacy">{t.privacy}</Link>
              <span className="separator">|</span>
              <Link to="/terms">{t.terms}</Link>
              <span className="separator">|</span>
              <Link to="/support">{t.support}</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </footer>
  );
};

export default Footer;
