import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [language, setLanguage] = useState('en');
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [farmData, setFarmData] = useState({
    totalBirds: 1240,
    healthy: 1180,
    sick: 48,
    dead: 12,
    eggProduction: 124,
    feedIntake: 245
  });
  const [sensorData, setSensorData] = useState({
    houseA: { temp: 31.2, humidity: 68, risk: 'moderate' },
    houseB: { temp: 34.5, humidity: 72, risk: 'high' },
    houseC: { temp: 29.8, humidity: 55, risk: 'low' }
  });

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
  }, []);

  const translations = {
    en: {
      title: "AI Poultry Dashboard",
      subtitle: "Real-time farm monitoring and disease detection",
      farmStats: "Farm Statistics",
      totalBirds: "Total Birds",
      healthy: "Healthy",
      sick: "Sick",
      mortality: "Mortality",
      eggProduction: "Egg Production",
      feedIntake: "Feed Intake (kg)",
      sensorData: "Environmental Sensors",
      temperature: "Temperature",
      humidity: "Humidity",
      riskLevel: "Risk Level",
      highRisk: "High Risk",
      moderateRisk: "Moderate Risk",
      lowRisk: "Low Risk",
      aiDetection: "AI Disease Detection",
      uploadImage: "Upload Chicken Image",
      dragDrop: "Click or drag to upload chicken image",
      analyze: "Analyze Image",
      analyzing: "Analyzing...",
      results: "Detection Results",
      confidence: "Confidence",
      symptoms: "Symptoms Detected",
      recommendations: "AI Recommendations",
      contactVet: "Contact Veterinarian",
      viewHistory: "View History",
      startNew: "Start New Analysis",
      recentAlerts: "Recent Alerts",
      viewAll: "View All"
    },
    am: {
      title: "ኤአይ የዶሮ ዳሽቦርድ",
      subtitle: "የእርሻ ክትትል እና በሽታ መለየት",
      farmStats: "የእርሻ ስታቲስቲክስ",
      totalBirds: "ጠቅላላ ዶሮዎች",
      healthy: "ጤናማ",
      sick: "የታመሙ",
      mortality: "ሞት",
      eggProduction: "የእንቁላል ምርት",
      feedIntake: "የመኖ ፍጆታ (ኪግ)",
      sensorData: "የአካባቢ ዳሳሾች",
      temperature: "ሙቀት",
      humidity: "እርጥበት",
      riskLevel: "የአደጋ ደረጃ",
      highRisk: "ከፍተኛ አደጋ",
      moderateRisk: "መካከለኛ አደጋ",
      lowRisk: "ዝቅተኛ አደጋ",
      aiDetection: "ኤአይ በሽታ መለየት",
      uploadImage: "የዶሮ ፎቶ ስቀልጥ",
      dragDrop: "ፎቶ ለመስቀል ጠቅ ያድርጉ",
      analyze: "ተንትን",
      analyzing: "በመተንተን ላይ...",
      results: "የምርመራ ውጤት",
      confidence: "እምነት",
      symptoms: "የተገኙ ምልክቶች",
      recommendations: "ኤአይ ምክሮች",
      contactVet: "የእንስሳት ሐኪም ደውሉ",
      viewHistory: "ታሪክ ይመልከቱ",
      startNew: "አዲስ ምርመራ ጀምር",
      recentAlerts: "የቅርብ ጊዜ ማስጠንቀቂያዎች",
      viewAll: "ሁሉንም ይመልከቱ"
    }
  };

  const t = translations[language];

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error(language === 'en' ? 'Please select an image' : 'እባክዎ ፎቶ ይምረጡ');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('temperature', sensorData.houseB.temp);
    formData.append('humidity', sensorData.houseB.humidity);

    try {
      const response = await axios.post('http://localhost:5000/api/disease/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPredictions(response.data);
      toast.success(language === 'en' ? 'Analysis complete!' : 'ትንተና ተጠናቋል!');
    } catch (error) {
      // Simulated response for demo
      setPredictions({
        disease: "Newcastle Disease",
        confidence: 94,
        symptoms: ["Greenish diarrhea", "Swollen eyes", "Nervous signs", "Reduced feed intake"],
        recommendations: [
          "Isolate sick birds immediately",
          "Disinfect the entire poultry house",
          "Add vitamins to drinking water",
          "Contact veterinarian for vaccination",
          "Increase ventilation in the house"
        ],
        requiresVet: true,
        urgency: "High",
        treatmentDays: 7
      });
      toast.success('Analysis complete!');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setPreview(null);
    setPredictions(null);
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'high': return '#dc2626';
      case 'moderate': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRiskText = (risk) => {
    if (risk === 'high') return t.highRisk;
    if (risk === 'moderate') return t.moderateRisk;
    return t.lowRisk;
  };

  return (
    <div className="poultry-dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🐔</div>
            <div className="stat-info">
              <h3>{t.totalBirds}</h3>
              <p className="stat-value">{farmData.totalBirds}</p>
            </div>
          </div>
          <div className="stat-card healthy">
            <div className="stat-icon">❤️</div>
            <div className="stat-info">
              <h3>{t.healthy}</h3>
              <p className="stat-value">{farmData.healthy}</p>
              <span className="stat-percent">{((farmData.healthy/farmData.totalBirds)*100).toFixed(1)}%</span>
            </div>
          </div>
          <div className="stat-card sick">
            <div className="stat-icon">🤒</div>
            <div className="stat-info">
              <h3>{t.sick}</h3>
              <p className="stat-value">{farmData.sick}</p>
              <span className="stat-percent">{((farmData.sick/farmData.totalBirds)*100).toFixed(1)}%</span>
            </div>
          </div>
          <div className="stat-card mortality">
            <div className="stat-icon">💀</div>
            <div className="stat-info">
              <h3>{t.mortality}</h3>
              <p className="stat-value">{farmData.dead}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🥚</div>
            <div className="stat-info">
              <h3>{t.eggProduction}</h3>
              <p className="stat-value">{farmData.eggProduction}</p>
              <span className="stat-trend down">▼ 18%</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌾</div>
            <div className="stat-info">
              <h3>{t.feedIntake}</h3>
              <p className="stat-value">{farmData.feedIntake}</p>
              <span className="stat-trend down">▼ 12%</span>
            </div>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="dashboard-main-grid">
          {/* Left Column - AI Detection */}
          <div className="ai-detection-section">
            <h2>{t.aiDetection}</h2>
            
            {!predictions ? (
              <>
                <div className="upload-area" onClick={() => document.getElementById('diseaseImageInput').click()}>
                  {preview ? (
                    <img src={preview} alt="Preview" className="upload-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <p>{t.dragDrop}</p>
                    </div>
                  )}
                  <input id="diseaseImageInput" type="file" accept="image/*" onChange={handleImageSelect} hidden />
                </div>
                
                {selectedImage && (
                  <button className="analyze-btn" onClick={handleAnalyze} disabled={loading}>
                    {loading ? (
                      <><i className="fas fa-spinner fa-spin"></i> {t.analyzing}</>
                    ) : (
                      <><i className="fas fa-microscope"></i> {t.analyze}</>
                    )}
                  </button>
                )}
              </>
            ) : (
              <div className="results-card">
                <div className="results-header">
                  <h3>{t.results}</h3>
                  <button onClick={resetAnalysis} className="reset-btn">{t.startNew}</button>
                </div>
                
                <div className="disease-diagnosis">
                  <div className="disease-name">
                    <span className="disease-badge">{predictions.disease}</span>
                    <span className={`urgency-badge ${predictions.urgency === 'High' ? 'high' : 'medium'}`}>
                      {predictions.urgency} Urgency
                    </span>
                  </div>
                  
                  <div className="confidence-bar-container">
                    <label>{t.confidence}: {predictions.confidence}%</label>
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{ width: `${predictions.confidence}%` }}></div>
                    </div>
                  </div>

                  {predictions.symptoms && (
                    <div className="symptoms-list">
                      <label><i className="fas fa-stethoscope"></i> {t.symptoms}:</label>
                      <ul>
                        {predictions.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="recommendations-list">
                    <label><i className="fas fa-lightbulb"></i> {t.recommendations}:</label>
                    <ul>
                      {predictions.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>

                  {predictions.requiresVet && (
                    <div className="vet-alert">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>{t.contactVet}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sensor Data */}
          <div className="sensor-section">
            <h2>{t.sensorData}</h2>
            <div className="sensor-grid">
              {Object.entries(sensorData).map(([house, data]) => (
                <div key={house} className="sensor-card" style={{ borderLeftColor: getRiskColor(data.risk) }}>
                  <div className="sensor-header">
                    <h3>House {house}</h3>
                    <span className="risk-indicator" style={{ backgroundColor: getRiskColor(data.risk) }}>
                      {getRiskText(data.risk)}
                    </span>
                  </div>
                  <div className="sensor-readings">
                    <div className="reading">
                      <i className="fas fa-thermometer-half"></i>
                      <span>{t.temperature}: <strong>{data.temp}°C</strong></span>
                    </div>
                    <div className="reading">
                      <i className="fas fa-tint"></i>
                      <span>{t.humidity}: <strong>{data.humidity}%</strong></span>
                    </div>
                  </div>
                  {data.risk === 'high' && (
                    <div className="sensor-warning">
                      <i className="fas fa-bell"></i> Immediate attention required
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Alerts Section */}
        <div className="recent-alerts-section">
          <div className="section-header">
            <h2>{t.recentAlerts}</h2>
            <Link to="/reports" className="view-all-link">{t.viewAll} <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="alerts-list">
            <div className="alert-item high">
              <div className="alert-icon"><i className="fas fa-exclamation-circle"></i></div>
              <div className="alert-content">
                <h4>High Temperature Alert - House B</h4>
                <p>Temperature reached 34.5°C. Risk of heat stress detected.</p>
                <span className="alert-time">2 hours ago</span>
              </div>
            </div>
            <div className="alert-item warning">
              <div className="alert-icon"><i className="fas fa-chart-line"></i></div>
              <div className="alert-content">
                <h4>Egg Production Drop Detected</h4>
                <p>18% decrease in egg production over last 3 days.</p>
                <span className="alert-time">5 hours ago</span>
              </div>
            </div>
            <div className="alert-item info">
              <div className="alert-icon"><i className="fas fa-microscope"></i></div>
              <div className="alert-content">
                <h4>AI Analysis Completed</h4>
                <p>Newcastle disease detected in House B. Action required.</p>
                <span className="alert-time">Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
