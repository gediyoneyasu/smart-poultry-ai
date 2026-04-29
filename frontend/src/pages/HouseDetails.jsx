import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './HouseDetails.css';

const HouseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [house, setHouse] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
    
    // Simulated house data
    const houses = {
      1: { id: 1, name: 'House A', birds: 420, capacity: 500, age: 8, health: 95, vaccinated: true, lastCleaned: '2024-01-15', temperature: 31.2, humidity: 68, feedIntake: 85, waterConsumption: 120, mortality: 2, eggProduction: 145 },
      2: { id: 2, name: 'House B', birds: 380, capacity: 500, age: 6, health: 82, vaccinated: false, lastCleaned: '2024-01-14', temperature: 34.5, humidity: 72, feedIntake: 78, waterConsumption: 110, mortality: 5, eggProduction: 118 },
      3: { id: 3, name: 'House C', birds: 440, capacity: 500, age: 10, health: 98, vaccinated: true, lastCleaned: '2024-01-16', temperature: 29.8, humidity: 55, feedIntake: 92, waterConsumption: 130, mortality: 1, eggProduction: 162 }
    };
    setHouse(houses[id]);
  }, [id]);

  const translations = {
    en: {
      back: "Back to Farm",
      houseDetails: "House Details",
      overview: "Overview",
      health: "Health",
      production: "Production",
      editHouse: "Edit House",
      birds: "Birds",
      capacity: "Capacity",
      occupancy: "Occupancy",
      age: "Age",
      vaccinated: "Vaccinated",
      lastCleaned: "Last Cleaned",
      temperature: "Temperature",
      humidity: "Humidity",
      feedIntake: "Feed Intake",
      waterConsumption: "Water Consumption",
      mortality: "Mortality",
      eggProduction: "Egg Production",
      healthScore: "Health Score",
      healthStatus: "Health Status",
      excellent: "Excellent",
      good: "Good",
      critical: "Critical",
      warnings: "Warnings & Alerts",
      recommendations: "Recommendations",
      history: "Health History",
      viewReport: "View Full Report"
    },
    am: {
      back: "ወደ እርሻ ተመለስ",
      houseDetails: "የቤት ዝርዝሮች",
      overview: "አጠቃላይ እይታ",
      health: "ጤና",
      production: "ምርት",
      editHouse: "ቤት አርትዕ",
      birds: "ዶሮዎች",
      capacity: "አቅም",
      occupancy: "የመጠን መጠን",
      age: "ዕድሜ",
      vaccinated: "ክትባት",
      lastCleaned: "የመጨረሻ ጽዳት",
      temperature: "ሙቀት",
      humidity: "እርጥበት",
      feedIntake: "የመኖ ፍጆታ",
      waterConsumption: "የውሃ ፍጆታ",
      mortality: "ሞት",
      eggProduction: "የእንቁላል ምርት",
      healthScore: "የጤና ነጥብ",
      healthStatus: "የጤና ሁኔታ",
      excellent: "በጣም ጥሩ",
      good: "ጥሩ",
      critical: "አደገኛ",
      warnings: "ማስጠንቀቂያዎች",
      recommendations: "ምክሮች",
      history: "የጤና ታሪክ",
      viewReport: "ሙሉ ሪፖርት ይመልከቱ"
    }
  };

  const t = translations[language];

  if (!house) {
    return <div className="house-loading">Loading...</div>;
  }

  const getHealthColor = (health) => {
    if (health >= 90) return '#10b981';
    if (health >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getHealthStatus = (health) => {
    if (health >= 90) return t.excellent;
    if (health >= 70) return t.good;
    return t.critical;
  };

  const occupancyRate = ((house.birds / house.capacity) * 100).toFixed(0);

  return (
    <div className="house-details-page">
      <div className="house-container">
        <div className="house-header">
          <Link to="/farm" className="back-link">
            <i className="fas fa-arrow-left"></i> {t.back}
          </Link>
          <div className="house-title">
            <h1>{house.name}</h1>
            <button className="edit-house-btn"><i className="fas fa-edit"></i> {t.editHouse}</button>
          </div>
        </div>

        <div className="house-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🐔</div>
            <div className="stat-info">
              <h3>{t.birds}</h3>
              <p className="stat-value">{house.birds} / {house.capacity}</p>
              <span className="stat-sub">{t.occupancy}: {occupancyRate}%</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{t.age}</h3>
              <p className="stat-value">{house.age} weeks</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💉</div>
            <div className="stat-info">
              <h3>{t.vaccinated}</h3>
              <p className="stat-value">{house.vaccinated ? '✓ ' + t.excellent : '⚠ ' + t.good}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🧹</div>
            <div className="stat-info">
              <h3>{t.lastCleaned}</h3>
              <p className="stat-value">{house.lastCleaned}</p>
            </div>
          </div>
        </div>

        <div className="house-tabs">
          <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <i className="fas fa-info-circle"></i> {t.overview}
          </button>
          <button className={`tab ${activeTab === 'health' ? 'active' : ''}`} onClick={() => setActiveTab('health')}>
            <i className="fas fa-heartbeat"></i> {t.health}
          </button>
          <button className={`tab ${activeTab === 'production' ? 'active' : ''}`} onClick={() => setActiveTab('production')}>
            <i className="fas fa-chart-line"></i> {t.production}
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="info-grid">
              <div className="info-card">
                <h3><i className="fas fa-thermometer-half"></i> Environment</h3>
                <div className="info-row"><span>{t.temperature}:</span><strong>{house.temperature}°C</strong><span className={house.temperature > 33 ? 'warning' : 'normal'}> {house.temperature > 33 ? '⚠ High' : 'Normal'}</span></div>
                <div className="info-row"><span>{t.humidity}:</span><strong>{house.humidity}%</strong><span className={house.humidity > 70 ? 'warning' : 'normal'}> {house.humidity > 70 ? '⚠ High' : 'Normal'}</span></div>
              </div>
              <div className="info-card">
                <h3><i className="fas fa-chart-simple"></i> Health Overview</h3>
                <div className="health-circle">
                  <svg width="120" height="120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                    <circle cx="60" cy="60" r="50" fill="none" stroke={getHealthColor(house.health)} strokeWidth="8" strokeDasharray={`${(house.health / 100) * 314} 314`} transform="rotate(-90 60 60)"/>
                  </svg>
                  <div className="health-percent">{house.health}%</div>
                </div>
                <p className="health-status">{getHealthStatus(house.health)}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="tab-content">
            <div className="health-metrics">
              <div className="metric-card">
                <i className="fas fa-chart-line"></i>
                <div className="metric-info">
                  <h4>{t.healthScore}</h4>
                  <p className="metric-value">{house.health}%</p>
                </div>
              </div>
              <div className="metric-card">
                <i className="fas fa-skull-crossbones"></i>
                <div className="metric-info">
                  <h4>{t.mortality}</h4>
                  <p className="metric-value">{house.mortality} birds</p>
                </div>
              </div>
            </div>
            
            <div className="warnings-section">
              <h3><i className="fas fa-exclamation-triangle"></i> {t.warnings}</h3>
              {house.temperature > 33 && <div className="warning-item">⚠️ High temperature detected! Risk of heat stress.</div>}
              {house.humidity > 70 && <div className="warning-item">⚠️ High humidity levels! Risk of respiratory issues.</div>}
              {!house.vaccinated && <div className="warning-item critical">⚠️ Vaccination overdue! Schedule vaccination immediately.</div>}
              {house.health < 85 && <div className="warning-item">⚠️ Health score below threshold. Monitor closely.</div>}
            </div>

            <div className="recommendations-section">
              <h3><i className="fas fa-lightbulb"></i> {t.recommendations}</h3>
              <div className="recommendation-item">✓ Increase ventilation to reduce temperature</div>
              <div className="recommendation-item">✓ Add electrolytes to drinking water</div>
              <div className="recommendation-item">✓ Schedule veterinary checkup</div>
              <div className="recommendation-item">✓ Clean and disinfect feeders</div>
            </div>
          </div>
        )}

        {activeTab === 'production' && (
          <div className="tab-content">
            <div className="production-metrics">
              <div className="metric-card">
                <i className="fas fa-egg"></i>
                <div className="metric-info">
                  <h4>{t.eggProduction}</h4>
                  <p className="metric-value">{house.eggProduction} eggs/day</p>
                </div>
              </div>
              <div className="metric-card">
                <i className="fas fa-wheat-alt"></i>
                <div className="metric-info">
                  <h4>{t.feedIntake}</h4>
                  <p className="metric-value">{house.feedIntake} kg/day</p>
                </div>
              </div>
              <div className="metric-card">
                <i className="fas fa-tint"></i>
                <div className="metric-info">
                  <h4>{t.waterConsumption}</h4>
                  <p className="metric-value">{house.waterConsumption} L/day</p>
                </div>
              </div>
            </div>
            
            <div className="trend-section">
              <h3>Production Trend</h3>
              <div className="trend-bars">
                <div className="trend-item"><span>Mon</span><div className="trend-bar" style={{ width: '85%' }}></div></div>
                <div className="trend-item"><span>Tue</span><div className="trend-bar" style={{ width: '82%' }}></div></div>
                <div className="trend-item"><span>Wed</span><div className="trend-bar" style={{ width: '78%' }}></div></div>
                <div className="trend-item"><span>Thu</span><div className="trend-bar" style={{ width: '74%' }}></div></div>
                <div className="trend-item"><span>Fri</span><div className="trend-bar" style={{ width: '70%' }}></div></div>
                <div className="trend-item"><span>Sat</span><div className="trend-bar" style={{ width: '68%' }}></div></div>
                <div className="trend-item"><span>Sun</span><div className="trend-bar" style={{ width: '65%' }}></div></div>
              </div>
            </div>
          </div>
        )}

        <div className="report-link">
          <Link to={`/reports?house=${house.id}`} className="report-btn">
            <i className="fas fa-file-alt"></i> {t.viewReport}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HouseDetails;
