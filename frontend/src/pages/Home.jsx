import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import './Home.css';

function Home() {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
  }, []);

  const translations = {
    en: {
      welcome: "Welcome to Smart Poultry AI",
      title: "AI-Powered Poultry",
      titleSpan: "Health Management",
      subtitle: "Detect diseases early, predict outbreaks, and get smart recommendations for healthier chickens",
      shopNow: "Start Diagnosis",
      contactUs: "Contact Us",
      featuresTitle: "Why Choose Smart Poultry AI?",
      features: [
        { icon: "fas fa-microscope", title: "AI Disease Detection", desc: "Instant diagnosis from chicken images" },
        { icon: "fas fa-chart-line", title: "Predictive Analytics", desc: "Forecast outbreaks before they happen" },
        { icon: "fas fa-robot", title: "Smart Assistant", desc: "24/7 AI chatbot in Amharic & English" },
        { icon: "fas fa-chalkboard-teacher", title: "Learning System", desc: "AI improves from farmer feedback" }
      ],
      categoriesTitle: "Poultry Diseases We Detect",
      viewAllCategories: "View All Diseases",
      featuredProducts: "AI Detection Features",
      viewAll: "Learn More",
      addToCart: "Try Now",
      projects: "Success Stories",
      viewAllProjects: "View All Stories",
      testimonials: "What Farmers Say",
      getStarted: "Get Started Free",
      detectDisease: "Detect Disease",
      predictOutbreak: "Predict Outbreak",
      getAdvice: "Get AI Advice",
      temperature: "Temperature",
      humidity: "Humidity",
      riskLevel: "Risk Level",
      highRisk: "High Risk",
      moderateRisk: "Moderate Risk",
      lowRisk: "Low Risk",
      healthy: "Healthy",
      sick: "Sick",
      mortality: "Mortality",
      totalBirds: "Total Birds",
      farmStats: "Your Farm Statistics",
      sensorData: "Environmental Monitoring",
      aiInsights: "AI Insights",
      uploadImage: "Upload Chicken Image",
      analyze: "Analyze Now",
      recommendations: "AI Recommendations",
      diseaseSolution: "Disease & Solutions",
      analyzeAI: "AI Analysis",
      farmReport: "Farm & Reports",
      getStartedBtn: "Get Started"
    },
    am: {
      welcome: "እንኳን ወደ ስማርት ዶሮ ኤአይ በደህና መጡ",
      title: "በኤአይ የሚመራ የዶሮ",
      titleSpan: "ጤና አያያዝ",
      subtitle: "በሽታዎችን ቀድመው ይለዩ፣ ወረርሽኞችን ይተንብዩ እና ለጤናማ ዶሮዎች ስማርት ምክሮችን ያግኙ",
      shopNow: "ምርመራ ጀምር",
      contactUs: "አግኙን",
      featuresTitle: "ለምን ስማርት ዶሮ ኤአይ ይመርጣሉ?",
      features: [
        { icon: "fas fa-microscope", title: "ኤአይ በሽታ መለየት", desc: "ከዶሮ ፎቶ ፈጣን ምርመራ" },
        { icon: "fas fa-chart-line", title: "ትንበያ ትንተና", desc: "ወረርሽኞችን ከመከሰታቸው በፊት ይተንብዩ" },
        { icon: "fas fa-robot", title: "ስማርት ረዳት", desc: "24/7 ኤአይ ቻትቦት በአማርኛ እና እንግሊዝኛ" },
        { icon: "fas fa-chalkboard-teacher", title: "ትምህርት ስርዓት", desc: "ኤአይ ከአርሶ አደር አስተያየት ይማራል" }
      ],
      categoriesTitle: "የምንለያቸው የዶሮ በሽታዎች",
      viewAllCategories: "ሁሉንም በሽታዎች ይመልከቱ",
      featuredProducts: "ኤአይ መለየት ባህሪያት",
      viewAll: "ተጨማሪ ይወቁ",
      addToCart: "አሁን ሞክር",
      projects: "የስኬት ታሪኮች",
      viewAllProjects: "ሁሉንም ታሪኮች ይመልከቱ",
      testimonials: "አርሶ አደሮች ምን ይላሉ",
      getStarted: "በነጻ ይጀምሩ",
      detectDisease: "በሽታ መለየት",
      predictOutbreak: "ወረርሽኝ ትንበያ",
      getAdvice: "ኤአይ ምክር አግኝ",
      temperature: "ሙቀት",
      humidity: "እርጥበት",
      riskLevel: "የአደጋ ደረጃ",
      highRisk: "ከፍተኛ አደጋ",
      moderateRisk: "መካከለኛ አደጋ",
      lowRisk: "ዝቅተኛ አደጋ",
      healthy: "ጤናማ",
      sick: "የታመሙ",
      mortality: "ሞት",
      totalBirds: "ጠቅላላ ዶሮዎች",
      farmStats: "የእርሻዎ ስታቲስቲክስ",
      sensorData: "የአካባቢ ክትትል",
      aiInsights: "ኤአይ ግንዛቤዎች",
      uploadImage: "የዶሮ ፎቶ ስቀልጥ",
      analyze: "አሁን ተንትን",
      recommendations: "ኤአይ ምክሮች",
      diseaseSolution: "በሽታ እና መፍትሄ",
      analyzeAI: "ኤአይ ትንተና",
      farmReport: "እርሻ እና ሪፖርቶች",
      getStartedBtn: "ይጀምሩ"
    }
  };

  const t = translations[language];

  const sliders = [
    {
      image: "https://media.istockphoto.com/id/1217649450/photo/chicken-or-hen-on-a-green-meadow.jpg?s=612x612&w=0&k=20&c=zRlZTkwoc-aWb3kI10OqlRLbiQw3R3_KUIchNVFgYgw=",
      title: "AI-Powered Disease Detection",
      titleAm: "በኤአይ የሚመራ በሽታ መለየት",
      subtitle: "Upload a chicken image and get instant diagnosis",
      subtitleAm: "የዶሮ ፎቶ ስቀልጥ እና ፈጣን ምርመራ ያግኙ",
      buttonText: "Start Diagnosis",
      buttonTextAm: "ምርመራ ጀምር",
      buttonLink: "/analyze"
    },
    {
      image: "https://media.istockphoto.com/id/1341463294/photo/close-up-of-brown-hen-free-range-chicken-in-the-grass.jpg?s=612x612&w=0&k=20&c=3BGTPIE55thCWNb9lenNIjda7fs0CyEPZaznfaAl0cQ=",
      title: "Make More Effective Your Production",
      titleAm: "ምርታማነትዎን የበለጠ ውጤታማ ያድርጉ",
      subtitle: "Get disease solutions and AI analysis to boost your farm productivity",
      subtitleAm: "የእርሻ ምርታማነትዎን ለማሳደግ የበሽታ መፍትሄዎችን እና የኤአይ ትንተና ያግኙ",
      button1Text: "Disease & Solutions",
      button1TextAm: "በሽታ እና መፍትሄ",
      button1Link: "/diseases",
      button2Text: "AI Analysis",
      button2TextAm: "ኤአይ ትንተና",
      button2Link: "/analyze"
    },
    {
      image: "https://media.istockphoto.com/id/1302227620/photo/brown-eggs-on-the-chicken-farm-hens-watching-their-laying.jpg?s=612x612&w=0&k=20&c=KsiPe2hQmIdWW8N4wc_A2h3vXTO4wg_C36gKB7gRlpA=",
      title: "Smart Farm Management",
      titleAm: "ስማርት የእርሻ አስተዳደር",
      subtitle: "Manage your farm efficiently with AI-powered insights and reports",
      subtitleAm: "በኤአይ በሚመሩ ግንዛቤዎች እና ሪፖርቶች እርሻዎን በብቃት ያስተዳድሩ",
      button1Text: "Farm Management",
      button1TextAm: "የእርሻ አስተዳደር",
      button1Link: "/farm",
      button2Text: "Reports",
      button2TextAm: "ሪፖርቶች",
      button2Link: "/reports"
    }
  ];

  return (
    <div className="poultry-home-page">
      {/* Hero Slider Section */}
      <div className="poultry-hero-slider">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          autoplay={{ delay: 5000 }}
          loop={true}
          effect="fade"
          pagination={{ clickable: true }}
          navigation={false}
          className="poultry-hero-swiper"
        >
          {sliders.map((slider, index) => (
            <SwiperSlide key={index} className="poultry-hero-slide">
              <div className="poultry-slide-bg" style={{ backgroundImage: `url(${slider.image})` }} />
              <div className="poultry-hero-content">
                <small>{t.welcome}</small>
                <h1>{language === 'en' ? slider.title : slider.titleAm}</h1>
                <p>{language === 'en' ? slider.subtitle : slider.subtitleAm}</p>
                <div className="poultry-hero-buttons">
                  {index === 0 && (
                    <>
                      <Link to={slider.buttonLink} className="poultry-btn-primary">{language === 'en' ? slider.buttonText : slider.buttonTextAm}</Link>
                      <a href="tel:+251964113416" className="poultry-btn-secondary">{t.contactUs}</a>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <Link to={slider.button1Link} className="poultry-btn-primary">{language === 'en' ? slider.button1Text : slider.button1TextAm}</Link>
                      <Link to={slider.button2Link} className="poultry-btn-secondary">{language === 'en' ? slider.button2Text : slider.button2TextAm}</Link>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <Link to={slider.button1Link} className="poultry-btn-primary">{language === 'en' ? slider.button1Text : slider.button1TextAm}</Link>
                      <Link to={slider.button2Link} className="poultry-btn-secondary">{language === 'en' ? slider.button2Text : slider.button2TextAm}</Link>
                    </>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Features Section */}
      <section className="poultry-features-section">
        <div className="poultry-container">
          <h2 className="poultry-section-title">{t.featuresTitle}</h2>
          <div className="poultry-features-grid">
            {t.features.map((feature, index) => (
              <div key={index} className="poultry-feature-card">
                <div className="poultry-feature-icon"><i className={feature.icon}></i></div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="poultry-stats-section">
        <div className="poultry-container">
          <h2 className="poultry-section-title">{t.farmStats}</h2>
          <div className="poultry-stats-grid">
            <div className="poultry-stat-card">
              <div className="poultry-stat-icon">🐔</div>
              <div className="poultry-stat-info">
                <h3>{t.totalBirds}</h3>
                <p className="poultry-stat-value">1,240</p>
              </div>
            </div>
            <div className="poultry-stat-card healthy">
              <div className="poultry-stat-icon">❤️</div>
              <div className="poultry-stat-info">
                <h3>{t.healthy}</h3>
                <p className="poultry-stat-value">1,180</p>
              </div>
            </div>
            <div className="poultry-stat-card sick">
              <div className="poultry-stat-icon">🤒</div>
              <div className="poultry-stat-info">
                <h3>{t.sick}</h3>
                <p className="poultry-stat-value">48</p>
              </div>
            </div>
            <div className="poultry-stat-card mortality">
              <div className="poultry-stat-icon">💀</div>
              <div className="poultry-stat-info">
                <h3>{t.mortality}</h3>
                <p className="poultry-stat-value">12</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories/Diseases Section */}
      <section className="poultry-categories-section">
        <div className="poultry-container">
          <div className="poultry-section-header">
            <h2 className="poultry-section-title">{t.categoriesTitle}</h2>
            <Link to="/diseases" className="poultry-view-all">{t.viewAllCategories} <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="poultry-categories-grid">
            {/* Add your category cards here - keeping existing code */}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="poultry-featured-section">
        <div className="poultry-container">
          <div className="poultry-section-header">
            <h2 className="poultry-section-title">{t.featuredProducts}</h2>
            <Link to="/dashboard" className="poultry-view-all">{t.viewAll} <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="poultry-products-grid">
            {/* Add your AI features cards here - keeping existing code */}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="poultry-testimonials-section">
        <div className="poultry-container">
          <h2 className="poultry-section-title">{t.testimonials}</h2>
          <div className="poultry-testimonials-grid">
            {/* Add your testimonials here - keeping existing code */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="poultry-cta-section">
        <div className="poultry-container">
          <div className="poultry-cta-content">
            <h2>{t.getStarted}</h2>
            <p>{language === 'en' ? 'Start protecting your poultry farm with AI today' : 'ዛሬውኑ የዶሮ እርሻዎን በኤአይ መጠበቅ ይጀምሩ'}</p>
            <Link to="/analyze" className="poultry-cta-btn">{t.getStartedBtn} <i className="fas fa-arrow-right"></i></Link>
          </div>
        </div>
      </section>

      {/* Floating AI Assistant Icon */}
      <Link to="/dashboard" className="floating-ai-icon">
        <div className="ai-icon">
          <i className="fas fa-robot"></i>
          <span className="ai-pulse"></span>
        </div>
        <div className="ai-tooltip">
          {language === 'en' ? 'AI Assistant' : 'ኤአይ ረዳት'}
        </div>
      </Link>
    </div>
  );
}

export default Home;
