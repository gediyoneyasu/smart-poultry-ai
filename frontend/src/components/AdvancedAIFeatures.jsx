import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import advancedAI from '../services/advancedAI';
import './AdvancedAIFeatures.css';

const AdvancedAIFeatures = () => {
  const [activeFeature, setActiveFeature] = useState('voice');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [videoAnalysis, setVideoAnalysis] = useState(null);
  const [isAnalyzingVideo, setIsAnalyzingVideo] = useState(false);
  const videoRef = useRef(null);
  const [language, setLanguage] = useState('en');
  
  // Predictive Maintenance
  const [maintenanceData, setMaintenanceData] = useState({
    temperature: 34.5,
    runtimeHours: 4200,
    lastMaintenance: '2024-01-15',
    vibration: 0.6,
    noiseLevel: 55
  });
  const [maintenancePrediction, setMaintenancePrediction] = useState(null);
  
  // Treatment Plans
  const [treatmentInput, setTreatmentInput] = useState({
    disease: 'Coccidiosis',
    severity: 'medium',
    birdAge: 6,
    flockSize: 500
  });
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  
  // Weather Integration
  const [weatherData, setWeatherData] = useState(null);
  const [weatherRisk, setWeatherRisk] = useState(null);
  const [flockHealth, setFlockHealth] = useState(85);

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
  }, []);

  // Voice Synthesis with language support
  const handleSpeak = (text, lang = 'en') => {
    setIsSpeaking(true);
    advancedAI.speakText(text, lang);
    setTimeout(() => setIsSpeaking(false), text.length * 80);
  };

  // Speak Amharic message
  const speakAmharicMessage = (messageKey) => {
    const message = advancedAI.getAmharicMessage(messageKey);
    handleSpeak(message, 'am');
    toast.success(`🔊 Speaking in Amharic: "${message.substring(0, 50)}..."`);
  };

  // Video Analysis
  const startVideoAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      toast.success('Camera ready! Analyzing video feed...');
      analyzeVideo();
    } catch (error) {
      toast.error('Unable to access camera');
    }
  };

  const analyzeVideo = async () => {
    setIsAnalyzingVideo(true);
    const interval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        const analysis = await advancedAI.analyzeVideoFrame(videoRef.current);
        setVideoAnalysis(analysis);
        
        if (analysis.abnormalMovements.length > 0) {
          toast.warning(`⚠️ ${analysis.abnormalMovements.join(', ')}`);
          if (language === 'am' && analysis.amharicMessage) {
            handleSpeak(analysis.amharicMessage, 'am');
          } else {
            handleSpeak(`Warning! ${analysis.abnormalMovements.join(', ')} detected`, 'en');
          }
        }
      }
    }, 5000);
    
    return () => clearInterval(interval);
  };

  const stopVideoAnalysis = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
      setVideoAnalysis(null);
      setIsAnalyzingVideo(false);
    }
  };

  // Predictive Maintenance
  const runMaintenancePrediction = () => {
    const prediction = advancedAI.predictMaintenanceNeeds(maintenanceData);
    setMaintenancePrediction(prediction);
    
    if (prediction.urgency === 'high') {
      toast.error('⚠️ Critical maintenance required!');
      if (language === 'am' && prediction.amharicMessage) {
        handleSpeak(prediction.amharicMessage, 'am');
      } else {
        handleSpeak('Critical maintenance alert! Please check ventilation system immediately.', 'en');
      }
    }
  };

  // Treatment Plan Generation
  const generateTreatment = () => {
    const plan = advancedAI.generateTreatmentPlan(
      treatmentInput.disease,
      treatmentInput.severity,
      treatmentInput.birdAge,
      treatmentInput.flockSize
    );
    setTreatmentPlan(plan);
    toast.success(`Treatment plan generated for ${treatmentInput.disease}`);
    
    if (language === 'am' && plan.amharicMessage) {
      handleSpeak(plan.amharicMessage, 'am');
    } else {
      handleSpeak(`Treatment plan generated for ${treatmentInput.disease}. Please follow the instructions.`, 'en');
    }
  };

  // Weather Integration
  const fetchWeatherData = async () => {
    toast.loading('Fetching weather data...', { id: 'weather' });
    const weather = await advancedAI.getWeatherForecast();
    setWeatherData(weather);
    
    if (weather) {
      const risk = advancedAI.predictOutbreakFromWeather(weather, flockHealth);
      setWeatherRisk(risk);
      
      if (risk.riskLevel === 'high') {
        toast.error('⚠️ High disease risk from weather!');
        if (language === 'am' && risk.amharicMessage) {
          handleSpeak(risk.amharicMessage, 'am');
        } else {
          handleSpeak('Weather alert! High disease risk predicted. Take preventive measures.', 'en');
        }
      }
    }
    toast.success('Weather data updated!', { id: 'weather' });
  };

  return (
    <div className="advanced-ai-container">
      {/* Language Indicator */}
      <div className="language-indicator">
        <span className={`lang-badge ${language === 'en' ? 'active' : ''}`}>🇬🇧 English</span>
        <span className={`lang-badge ${language === 'am' ? 'active' : ''}`}>🇪🇹 አማርኛ</span>
      </div>

      {/* Feature Tabs */}
      <div className="feature-tabs">
        <button className={`feature-tab ${activeFeature === 'voice' ? 'active' : ''}`} onClick={() => setActiveFeature('voice')}>
          <i className="fas fa-volume-up"></i> Voice AI
        </button>
        <button className={`feature-tab ${activeFeature === 'video' ? 'active' : ''}`} onClick={() => setActiveFeature('video')}>
          <i className="fas fa-video"></i> Video Analysis
        </button>
        <button className={`feature-tab ${activeFeature === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveFeature('maintenance')}>
          <i className="fas fa-tools"></i> Predictive Maintenance
        </button>
        <button className={`feature-tab ${activeFeature === 'treatment' ? 'active' : ''}`} onClick={() => setActiveFeature('treatment')}>
          <i className="fas fa-file-medical"></i> Treatment Plans
        </button>
        <button className={`feature-tab ${activeFeature === 'weather' ? 'active' : ''}`} onClick={() => setActiveFeature('weather')}>
          <i className="fas fa-cloud-sun"></i> Weather AI
        </button>
      </div>

      {/* Voice Synthesis Feature */}
      {activeFeature === 'voice' && (
        <div className="feature-content voice-feature">
          <h2><i className="fas fa-microphone-alt"></i> AI Voice Assistant</h2>
          <p>Click any button to hear AI speak in <strong>English or Amharic (አማርኛ)</strong></p>
          
          <div className="voice-buttons">
            <h3>🇬🇧 English Messages</h3>
            <button onClick={() => handleSpeak("Welcome to Smart Poultry AI. How can I help you today?", 'en')}>
              <i className="fas fa-greeting"></i> Greeting Message
            </button>
            <button onClick={() => handleSpeak("Your chickens are healthy. Continue regular monitoring.", 'en')}>
              <i className="fas fa-heartbeat"></i> Health Update
            </button>
            <button onClick={() => handleSpeak("Alert! High temperature detected. Please increase ventilation.", 'en')}>
              <i className="fas fa-exclamation-triangle"></i> Alert Message
            </button>
            
            <h3>🇪🇹 የአማርኛ መልዕክቶች (Amharic Messages)</h3>
            <button onClick={() => speakAmharicMessage('greeting')}>
              <i className="fas fa-hands-helping"></i> እንኳን ደህና መጡ (Welcome)
            </button>
            <button onClick={() => speakAmharicMessage('healthGood')}>
              <i className="fas fa-check-circle"></i> ጤናማ ሁኔታ (Health Good)
            </button>
            <button onClick={() => speakAmharicMessage('healthAlert')}>
              <i className="fas fa-bell"></i> ማስጠንቀቂያ (Alert)
            </button>
            <button onClick={() => speakAmharicMessage('vaccineReminder')}>
              <i className="fas fa-syringe"></i> የክትባት ማሳሰቢያ (Vaccine Reminder)
            </button>
            <button onClick={() => speakAmharicMessage('eggProduction')}>
              <i className="fas fa-egg"></i> የእንቁላል ምርት (Egg Production)
            </button>
          </div>
          
          {isSpeaking && (
            <div className="speaking-indicator">
              <i className="fas fa-volume-up fa-pulse"></i> AI is speaking... / ኤአይ እየተናገረ ነው...
            </div>
          )}
        </div>
      )}

      {/* Video Analysis Feature */}
      {activeFeature === 'video' && (
        <div className="feature-content video-feature">
          <h2><i className="fas fa-video"></i> AI Video Analysis</h2>
          <p>Real-time disease detection from video feed</p>
          
          <div className="video-controls">
            {!videoStream ? (
              <button className="start-video-btn" onClick={startVideoAnalysis}>
                <i className="fas fa-play"></i> Start Video Analysis
              </button>
            ) : (
              <button className="stop-video-btn" onClick={stopVideoAnalysis}>
                <i className="fas fa-stop"></i> Stop Analysis
              </button>
            )}
          </div>
          
          {videoStream && (
            <div className="video-container">
              <video ref={videoRef} autoPlay playsInline className="analysis-video" />
              {videoAnalysis && (
                <div className="video-analysis-results">
                  <h3>Analysis Results / ውጤት</h3>
                  <div className="analysis-grid">
                    <div className="analysis-item">
                      <span>🐔 Birds Detected:</span>
                      <strong>{videoAnalysis.birdCount}</strong>
                    </div>
                    <div className="analysis-item">
                      <span>📊 Health Score:</span>
                      <strong>{videoAnalysis.estimatedHealthScore}%</strong>
                    </div>
                    {videoAnalysis.abnormalMovements.length > 0 && (
                      <div className="analysis-item warning">
                        <span>⚠️ Abnormal:</span>
                        <strong>{videoAnalysis.abnormalMovements.join(', ')}</strong>
                      </div>
                    )}
                  </div>
                  <p className="recommendation">💡 {videoAnalysis.recommendations}</p>
                  {language === 'am' && videoAnalysis.amharicMessage && (
                    <button className="speak-result-btn" onClick={() => handleSpeak(videoAnalysis.amharicMessage, 'am')}>
                      <i className="fas fa-volume-up"></i> Listen in Amharic / በአማርኛ ያዳምጡ
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Predictive Maintenance Feature */}
      {activeFeature === 'maintenance' && (
        <div className="feature-content maintenance-feature">
          <h2><i className="fas fa-chart-line"></i> Predictive Maintenance AI</h2>
          <p>Predict equipment failures before they happen</p>
          
          <div className="maintenance-inputs">
            <div className="input-group">
              <label>Temperature (°C) / ሙቀት</label>
              <input type="number" value={maintenanceData.temperature} onChange={(e) => setMaintenanceData({...maintenanceData, temperature: parseFloat(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>Runtime Hours / የስራ ሰዓት</label>
              <input type="number" value={maintenanceData.runtimeHours} onChange={(e) => setMaintenanceData({...maintenanceData, runtimeHours: parseFloat(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>Vibration Level / ንዝረት</label>
              <input type="number" step="0.1" value={maintenanceData.vibration} onChange={(e) => setMaintenanceData({...maintenanceData, vibration: parseFloat(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>Noise Level (dB) / ጫጫታ</label>
              <input type="number" value={maintenanceData.noiseLevel} onChange={(e) => setMaintenanceData({...maintenanceData, noiseLevel: parseFloat(e.target.value)})} />
            </div>
          </div>
          
          <button className="predict-btn" onClick={runMaintenancePrediction}>
            <i className="fas fa-calculator"></i> Run Predictive Analysis
          </button>
          
          {maintenancePrediction && (
            <div className={`maintenance-results ${maintenancePrediction.urgency}`}>
              <h3>🔧 Equipment Health Report</h3>
              <div className="result-item">
                <span>Overall Status:</span>
                <strong className={maintenancePrediction.overallHealth.toLowerCase()}>{maintenancePrediction.overallHealth}</strong>
              </div>
              {maintenancePrediction.risks.map((risk, i) => (
                <div key={i} className="result-item warning">
                  <span>⚠️ Risk:</span>
                  <strong>{risk}</strong>
                </div>
              ))}
              <div className="result-item">
                <span>⏰ Time to Failure:</span>
                <strong>{maintenancePrediction.estimatedTimeToFailure}</strong>
              </div>
              <div className="recommendations-list">
                <strong>📋 Recommendations:</strong>
                <ul>
                  {maintenancePrediction.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
              {maintenancePrediction.amharicMessage && (
                <button className="speak-result-btn" onClick={() => handleSpeak(maintenancePrediction.amharicMessage, 'am')}>
                  <i className="fas fa-volume-up"></i> Listen in Amharic
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Automated Treatment Plans Feature */}
      {activeFeature === 'treatment' && (
        <div className="feature-content treatment-feature">
          <h2><i className="fas fa-notes-medical"></i> AI Treatment Plans</h2>
          <p>Automated disease treatment protocols</p>
          
          <div className="treatment-inputs">
            <div className="input-group">
              <label>Disease / በሽታ</label>
              <select value={treatmentInput.disease} onChange={(e) => setTreatmentInput({...treatmentInput, disease: e.target.value})}>
                <option value="Newcastle Disease">Newcastle Disease (ኒውካስል)</option>
                <option value="Coccidiosis">Coccidiosis (ኮክሲዲዮሲስ)</option>
                <option value="Fowl Pox">Fowl Pox (የዶሮ ፖክስ)</option>
              </select>
            </div>
            <div className="input-group">
              <label>Severity / ክብደት</label>
              <select value={treatmentInput.severity} onChange={(e) => setTreatmentInput({...treatmentInput, severity: e.target.value})}>
                <option value="low">Low / ዝቅተኛ</option>
                <option value="medium">Medium / መካከለኛ</option>
                <option value="high">High / ከፍተኛ</option>
              </select>
            </div>
            <div className="input-group">
              <label>Bird Age (weeks) / ዕድሜ</label>
              <input type="number" value={treatmentInput.birdAge} onChange={(e) => setTreatmentInput({...treatmentInput, birdAge: parseInt(e.target.value)})} />
            </div>
            <div className="input-group">
              <label>Flock Size / ብዛት</label>
              <input type="number" value={treatmentInput.flockSize} onChange={(e) => setTreatmentInput({...treatmentInput, flockSize: parseInt(e.target.value)})} />
            </div>
          </div>
          
          <button className="generate-btn" onClick={generateTreatment}>
            <i className="fas fa-file-prescription"></i> Generate Treatment Plan
          </button>
          
          {treatmentPlan && (
            <div className="treatment-results">
              <h3>📋 Treatment Plan for {treatmentPlan.disease} / ለ{treatmentPlan.amharicDisease} የህክምና እቅድ</h3>
              <div className="treatment-section">
                <strong>🚨 Immediate Action / ወዲያውኑ እርምጃ:</strong>
                <p>{treatmentPlan.treatmentPlan.immediate}</p>
              </div>
              <div className="treatment-section">
                <strong>💊 Medication / መድሀኒት:</strong>
                <p>{treatmentPlan.treatmentPlan.medication}</p>
                <div className="dosage-details">
                  <span>Dosage: {treatmentPlan.treatmentPlan.dosage}</span>
                </div>
              </div>
              <div className="treatment-section">
                <strong>❤️ Supportive Care / የድጋፍ እንክብካቤ:</strong>
                <ul>
                  {treatmentPlan.treatmentPlan.supportiveCare.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="treatment-footer">
                <div className="cost">💰 Estimated Cost: {treatmentPlan.estimatedCost}</div>
                <div className="success">📈 Success Rate: {treatmentPlan.successRate}</div>
                <div className="timeline">⏱️ Recovery Time: {treatmentPlan.treatmentPlan.timeline}</div>
              </div>
              {treatmentPlan.amharicMessage && (
                <button className="speak-result-btn" onClick={() => handleSpeak(treatmentPlan.amharicMessage, 'am')}>
                  <i className="fas fa-volume-up"></i> Listen in Amharic
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Weather Integration Feature */}
      {activeFeature === 'weather' && (
        <div className="feature-content weather-feature">
          <h2><i className="fas fa-cloud-sun-rain"></i> WeatherAI - Outbreak Prediction</h2>
          <p>Weather-powered disease outbreak forecasting</p>
          
          <div className="weather-controls">
            <div className="input-group">
              <label>Flock Health Score (%) / የመንጋ ጤና</label>
              <input type="number" value={flockHealth} onChange={(e) => setFlockHealth(parseInt(e.target.value))} />
            </div>
            <button className="fetch-weather-btn" onClick={fetchWeatherData}>
              <i className="fas fa-cloud-download-alt"></i> Fetch Weather Data
            </button>
          </div>
          
          {weatherData && (
            <div className="weather-current">
              <h3>🌡️ Current Conditions / የአሁኑ ሁኔታ</h3>
              <div className="current-temp">
                <i className="fas fa-thermometer-half"></i>
                {weatherData.current.temp}°C
              </div>
              <div className="current-stats">
                <span>💧 Humidity: {weatherData.current.humidity}%</span>
                <span>🌬️ Wind: {weatherData.current.windSpeed} km/h</span>
                <span>☁️ {weatherData.current.condition}</span>
              </div>
            </div>
          )}
          
          {weatherRisk && (
            <div className={`weather-risk ${weatherRisk.riskLevel}`}>
              <h3>🚨 Disease Risk Assessment</h3>
              <div className="risk-level">
                Risk Level: <strong>{weatherRisk.riskLevel.toUpperCase()}</strong>
              </div>
              <div className="risk-probability">
                Outbreak Probability: {weatherRisk.probability}%
              </div>
              <div className="risk-factors">
                <strong>Contributing Factors:</strong>
                <ul>
                  {weatherRisk.contributingFactors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </div>
              <div className="prevention-actions">
                <strong>📋 Recommended Actions:</strong>
                <ul>
                  {weatherRisk.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
              {weatherRisk.weatherAlert && (
                <div className="weather-alert">
                  <i className="fas fa-bell"></i> {weatherRisk.weatherAlert}
                </div>
              )}
              {weatherRisk.amharicMessage && (
                <button className="speak-result-btn" onClick={() => handleSpeak(weatherRisk.amharicMessage, 'am')}>
                  <i className="fas fa-volume-up"></i> Listen in Amharic
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedAIFeatures;
