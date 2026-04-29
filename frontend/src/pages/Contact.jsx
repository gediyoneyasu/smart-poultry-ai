import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = 'http://localhost:5001/api';

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
  }, []);

  const translations = {
    en: {
      title: "Contact Us",
      subtitle: "Get in touch with our support team",
      contactInfo: "Contact Information",
      address: "Address",
      phone: "Phone",
      email: "Email",
      workingHours: "Working Hours",
      monFri: "Monday - Friday: 8:00 AM - 6:00 PM",
      sat: "Saturday: 9:00 AM - 4:00 PM",
      sun: "Sunday: Closed",
      sendMessage: "Send Message",
      name: "Full Name",
      subject: "Subject",
      message: "Message",
      yourName: "Your full name",
      yourEmail: "Your email address",
      yourPhone: "Your phone number",
      yourSubject: "What is this regarding?",
      yourMessage: "Describe your issue or question",
      sending: "Sending...",
      sent: "Message Sent!",
      successMsg: "We'll get back to you within 24 hours",
      emergency: "Emergency? Call us immediately:",
      emergencyNote: "For urgent veterinary assistance, please call our emergency hotline",
      callNow: "Call Now",
      followUs: "Follow Us",
      getDirection: "Get Directions",
      messageSent: "Your message has been sent successfully!",
      messageError: "Failed to send message. Please try again."
    },
    am: {
      title: "አግኙን",
      subtitle: "ከድጋፍ ቡድናችን ጋር ይገናኙ",
      contactInfo: "የመገናኛ መረጃ",
      address: "አድራሻ",
      phone: "ስልክ",
      email: "ኢሜይል",
      workingHours: "የስራ ሰዓት",
      monFri: "ሰኞ - አርብ: 8:00 ጠዋት - 6:00 ማታ",
      sat: "ቅዳሜ: 9:00 ጠዋት - 4:00 ማታ",
      sun: "እሁድ: ዝግ ነው",
      sendMessage: "መልዕክት ላክ",
      name: "ሙሉ ስም",
      subject: "ርዕስ",
      message: "መልዕክት",
      yourName: "ሙሉ ስምዎ",
      yourEmail: "ኢሜይል አድራሻዎ",
      yourPhone: "ስልክ ቁጥርዎ",
      yourSubject: "ይህ ምንን ይመለከታል?",
      yourMessage: "ችግርዎን ወይም ጥያቄዎን ይግለጹ",
      sending: "በመላክ ላይ...",
      sent: "መልዕክት ተልኳል!",
      successMsg: "በ24 ሰዓታት ውስጥ እንመልሳለን",
      emergency: "አስቸኳይ? ወዲያውኑ ይደውሉልን:",
      emergencyNote: "አስቸኳይ የእንስሳት ህክምና እርዳታ ለማግኘት እባክዎ ወደ አስቸኳይ ሙቅ መስመራችን ይደውሉ",
      callNow: "አሁን ይደውሉ",
      followUs: "ይከተሉን",
      getDirection: "አቅጣጫ ያግኙ",
      messageSent: "መልዕክትዎ በተሳካ ሁኔታ ተልኳል!",
      messageError: "መልዕክት መላክ አልተሳካም. እባክዎ እንደገና ይሞክሩ."
    }
  };

  const t = translations[language];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API_URL}/contact/submit`, formData);
      
      if (response.status === 201 || response.status === 200) {
        toast.success(t.messageSent);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error(t.messageError);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || t.messageError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-section">
            <h2>{t.contactInfo}</h2>
            
            <div className="info-card">
              <div className="info-item">
                <div className="info-icon"><i className="fas fa-map-marker-alt"></i></div>
                <div className="info-content">
                  <h3>{t.address}</h3>
                  <p>Bishoftu Town, Oromia Region<br />Ethiopia, PO Box: 1234</p>
                  <Link to="#" className="direction-link">{t.getDirection} <i className="fas fa-external-link-alt"></i></Link>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon"><i className="fas fa-phone-alt"></i></div>
                <div className="info-content">
                  <h3>{t.phone}</h3>
                  <p>+251 911 234 567<br />+251 922 345 678</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon"><i className="fas fa-envelope"></i></div>
                <div className="info-content">
                  <h3>{t.email}</h3>
                  <p>info@smartpoultryai.com<br />support@smartpoultryai.com</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon"><i className="fas fa-clock"></i></div>
                <div className="info-content">
                  <h3>{t.workingHours}</h3>
                  <p>{t.monFri}<br />{t.sat}<br />{t.sun}</p>
                </div>
              </div>
            </div>

            <div className="emergency-card">
              <div className="emergency-icon"><i className="fas fa-ambulance"></i></div>
              <div className="emergency-content">
                <h3>{t.emergency}</h3>
                <p>{t.emergencyNote}</p>
                <a href="tel:+251911234567" className="emergency-btn">
                  <i className="fas fa-phone"></i> {t.callNow}
                </a>
              </div>
            </div>

            <div className="social-section">
              <h3>{t.followUs}</h3>
              <div className="social-links">
                <a href="#" className="social-link facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-link twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-link instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-link linkedin"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" className="social-link telegram"><i className="fab fa-telegram-plane"></i></a>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <h2>{t.sendMessage}</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{t.name} *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t.yourName} required />
                  <i className="fas fa-user input-icon"></i>
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t.yourEmail} required />
                  <i className="fas fa-envelope input-icon"></i>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{t.phone}</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={t.yourPhone} />
                  <i className="fas fa-phone input-icon"></i>
                </div>
                <div className="form-group">
                  <label>{t.subject} *</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder={t.yourSubject} required />
                  <i className="fas fa-tag input-icon"></i>
                </div>
              </div>
              
              <div className="form-group full-width">
                <label>{t.message} *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="5" placeholder={t.yourMessage} required></textarea>
                <i className="fas fa-comment-dots input-icon"></i>
              </div>
              
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><i className="fas fa-spinner fa-spin"></i> {t.sending}</>
                ) : (
                  <><i className="fas fa-paper-plane"></i> {t.sendMessage}</>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="map-section">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d38.978!3d8.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwNDUnMDAuMCJOIDM4wrA1OCcwMC4wIkU!5e0!3m2!1sen!2set!4v1!5m2!1sen!2set"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Farm Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
