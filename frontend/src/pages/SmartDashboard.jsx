import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import realAI from '../services/realAI';
import AdvancedAIFeatures from '../components/AdvancedAIFeatures';
import './SmartDashboard.css';

const SmartDashboard = () => {
  const [language, setLanguage] = useState('en');
  const [activeModule, setActiveModule] = useState('detection');
  const [aiReady, setAiReady] = useState(false);
  
  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef(null);
  
  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  
  // Image AI
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const imageRef = useRef(null);
  
  // Prediction AI
  const [predictionData, setPredictionData] = useState({
    temperature: 34.5,
    humidity: 72,
    feedIntake: 85,
    eggProduction: 124,
    waterConsumption: 110,
    birdAge: 6
  });
  const [predictionResult, setPredictionResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);
  
  // Chatbot
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', content: '🤖 **REAL AI Assistant Ready!**\n\nI am powered by Google Gemini AI. I can understand natural language, voice input, and both English & Amharic.\n\n**Features:**\n• 🎤 Voice input support (Click mic and speak)\n• 📷 Camera capture for images\n• 🩺 Disease diagnosis\n• 🥚 Egg production tips\n• 💊 Treatment advice\n• 💉 Vaccination schedules\n\nHow can I help you today?', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  
  // Learning System
  const [learningData, setLearningData] = useState({
    totalPredictions: 147,
    accuracyRate: 89,
    farmerCorrections: 32,
    lastModelUpdate: '2024-01-20',
    weeklyAccuracy: [85, 86, 87, 88, 89, 89, 90]
  });
  const [feedback, setFeedback] = useState({ wasCorrect: null, actualDisease: '', comments: '' });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Sensor data for display
  const sensorData = {
    houseA: { temp: 31.2, humidity: 68, airQuality: 92, noise: 45, risk: 'low' },
    houseB: { temp: 34.5, humidity: 72, airQuality: 78, noise: 52, risk: 'high' },
    houseC: { temp: 29.8, humidity: 55, airQuality: 95, noise: 38, risk: 'low' }
  };

  const translations = {
    en: {
      title: "REAL AI Dashboard",
      subtitle: "Powered by Google Gemini AI | Voice & Camera Enabled",
      modules: {
        detection: "📷 Image AI + Camera",
        prediction: "📊 Prediction AI",
        chatbot: "💬 AI Assistant + Voice",
        sensors: "🌡️ Sensors",
        learning: "🧠 Learning System",
        advanced: "🔬 Advanced AI"
      }
    },
    am: {
      title: "እውነተኛ ኤአይ ዳሽቦርድ",
      subtitle: "በGoogle Gemini AI የተጎላበተ | ድምጽ እና ካሜራ",
      modules: {
        detection: "📷 ኤአይ ምስል + ካሜራ",
        prediction: "📊 ኤአይ ትንበያ",
        chatbot: "💬 ኤአይ ረዳት + ድምጽ",
        sensors: "🌡️ ዳሳሾች",
        learning: "🧠 ትምህርት",
        advanced: "🔬 የላቀ ኤአይ"
      }
    }
  };

  const t = translations[language];

  // Define handleSendMessageWithText
  const handleSendMessageWithText = useCallback(async (text) => {
    setChatMessages(prev => [...prev, { role: 'user', content: text, timestamp: new Date() }]);
    setChatInput('');
    setIsTyping(true);
    
    try {
      const response = await realAI.getRealAIResponse(text, language);
      setChatMessages(prev => [...prev, { role: 'bot', content: response, timestamp: new Date() }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I had trouble processing that. Please try again.', timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  }, [language]);

  // Initialize Voice Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'en' ? 'en-US' : 'am-ET';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
        setIsListening(false);
        toast.success(`Voice: "${transcript}"`);
        handleSendMessageWithText(transcript);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition failed');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      setVoiceSupported(true);
    } else {
      setVoiceSupported(false);
    }
    
    const initAI = async () => {
      const geminiReady = realAI.initGemini();
      const tfReady = await realAI.initTensorFlow();
      setAiReady(geminiReady || tfReady);
      if (geminiReady) {
        toast.success('REAL AI is ready!');
      }
    };
    initAI();
    
    const savedLang = localStorage.getItem('language');
    if (savedLang) setLanguage(savedLang);
    scrollToBottom();
  }, [handleSendMessageWithText, language]);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'en' ? 'en-US' : 'am-ET';
    }
  }, [language]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Voice Input
  const startVoiceInput = () => {
    if (!voiceSupported) {
      toast.error('Voice input not supported');
      return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        toast.success('🎤 Listening... Speak your question now');
      } catch (error) {
        toast.error('Please click again');
      }
    }
  };

  // Camera Functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setShowCamera(true);
    } catch (error) {
      toast.error('Unable to access camera');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      setPreview(imageData);
      
      fetch(imageData)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          setSelectedImage(file);
          const img = new Image();
          img.src = imageData;
          img.onload = () => {
            imageRef.current = img;
          };
        });
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setShowCamera(false);
      toast.success('Photo captured!');
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          imageRef.current = img;
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage || !imageRef.current) {
      toast.error('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    toast.loading('AI analyzing image...', { id: 'analysis' });
    
    try {
      const result = await realAI.analyzeImageReal(imageRef.current);
      setDetectionResult(result);
      toast.success('Analysis complete!', { id: 'analysis' });
    } catch (error) {
      toast.error('Analysis failed', { id: 'analysis' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePredict = () => {
    setIsPredicting(true);
    toast.loading('AI calculating risk...', { id: 'prediction' });
    
    setTimeout(() => {
      const result = realAI.predictOutbreakReal(predictionData);
      setPredictionResult(result);
      toast.success('Prediction complete!', { id: 'prediction' });
      setIsPredicting(false);
    }, 1000);
  };

  const updatePredictionData = (field, value) => {
    setPredictionData({ ...predictionData, [field]: parseFloat(value) });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    handleSendMessageWithText(chatInput);
  };

  const quickQuestion = (question) => {
    setChatInput(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleFeedbackSubmit = () => {
    if (feedback.wasCorrect === null) {
      toast.error('Please tell us if AI was correct');
      return;
    }
    
    setLearningData(prev => ({
      ...prev,
      farmerCorrections: prev.farmerCorrections + 1,
      accuracyRate: feedback.wasCorrect ? prev.accuracyRate + 0.5 : prev.accuracyRate - 1
    }));
    
    setFeedbackSubmitted(true);
    toast.success('Thank you! AI will learn');
    
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedback({ wasCorrect: null, actualDisease: '', comments: '' });
    }, 3000);
  };

  return (
    <div className="smart-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>{t.title} {aiReady && <span className="ai-badge">🤖 REAL AI ACTIVE</span>}</h1>
          <p>{t.subtitle}</p>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="camera-modal">
            <div className="camera-content">
              <video ref={videoRef} autoPlay playsInline className="camera-video" />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="camera-controls">
                <button onClick={capturePhoto} className="capture-btn">📸 Capture</button>
                <button onClick={closeCamera} className="close-camera-btn">✖ Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Module Tabs */}
        <div className="module-tabs">
          <button className={`module-tab ${activeModule === 'detection' ? 'active' : ''}`} onClick={() => setActiveModule('detection')}>{t.modules.detection}</button>
          <button className={`module-tab ${activeModule === 'prediction' ? 'active' : ''}`} onClick={() => setActiveModule('prediction')}>{t.modules.prediction}</button>
          <button className={`module-tab ${activeModule === 'chatbot' ? 'active' : ''}`} onClick={() => setActiveModule('chatbot')}>{t.modules.chatbot}</button>
          <button className={`module-tab ${activeModule === 'sensors' ? 'active' : ''}`} onClick={() => setActiveModule('sensors')}>{t.modules.sensors}</button>
          <button className={`module-tab ${activeModule === 'learning' ? 'active' : ''}`} onClick={() => setActiveModule('learning')}>{t.modules.learning}</button>
          <button className={`module-tab ${activeModule === 'advanced' ? 'active' : ''}`} onClick={() => setActiveModule('advanced')}>{t.modules.advanced}</button>
        </div>

        {/* Detection Module */}
        {activeModule === 'detection' && (
          <div className="module-content">
            <div className="detection-grid">
              <div className="upload-section">
                <div className="button-group">
                  <button className="upload-btn" onClick={() => document.getElementById('imageInput').click()}>📁 Upload Image</button>
                  <button className="camera-btn" onClick={startCamera}>📸 Take Photo</button>
                  <input id="imageInput" type="file" accept="image/*" onChange={handleImageSelect} hidden />
                </div>
                <div className="upload-area">
                  {preview ? <img src={preview} alt="Preview" className="image-preview" /> : <div className="upload-placeholder"><i className="fas fa-cloud-upload-alt"></i><p>Upload or capture an image</p></div>}
                </div>
                {selectedImage && <button className="analyze-btn" onClick={handleAnalyzeImage} disabled={isAnalyzing}>{isAnalyzing ? 'Analyzing...' : '🔬 Analyze with AI'}</button>}
              </div>
              <div className="results-section">
                <h3>AI Results</h3>
                {detectionResult ? (
                  <div>
                    <div className="disease-badge">{detectionResult.disease}</div>
                    <div className="confidence-bar"><div className="confidence-fill" style={{ width: `${detectionResult.confidence}%` }}></div><span>Confidence: {detectionResult.confidence}%</span></div>
                    <div className="symptoms-list"><strong>Symptoms:</strong><ul>{detectionResult.symptoms.map((s, i) => <li key={i}>• {s}</li>)}</ul></div>
                    <div className="recommendations-list"><strong>Recommendations:</strong><ul>{detectionResult.recommendations.map((r, i) => <li key={i}>✓ {r}</li>)}</ul></div>
                  </div>
                ) : <div className="no-results"><i className="fas fa-microscope"></i><p>Upload an image for AI analysis</p></div>}
              </div>
            </div>
          </div>
        )}

        {/* Prediction Module */}
        {activeModule === 'prediction' && (
          <div className="module-content">
            <div className="prediction-grid">
              <div className="input-section">
                <div className="input-row"><div className="input-group"><label>Temperature (°C)</label><input type="number" value={predictionData.temperature} onChange={(e) => updatePredictionData('temperature', e.target.value)} /></div>
                <div className="input-group"><label>Humidity (%)</label><input type="number" value={predictionData.humidity} onChange={(e) => updatePredictionData('humidity', e.target.value)} /></div></div>
                <div className="input-row"><div className="input-group"><label>Feed Intake (kg)</label><input type="number" value={predictionData.feedIntake} onChange={(e) => updatePredictionData('feedIntake', e.target.value)} /></div>
                <div className="input-group"><label>Egg Production</label><input type="number" value={predictionData.eggProduction} onChange={(e) => updatePredictionData('eggProduction', e.target.value)} /></div></div>
                <button className="predict-btn" onClick={handlePredict} disabled={isPredicting}>{isPredicting ? 'Calculating...' : '📊 Generate Prediction'}</button>
              </div>
              <div className="prediction-results">
                <h3>Prediction Results</h3>
                {predictionResult ? (
                  <div className="prediction-card">
                    <div className={`risk-indicator ${predictionResult.riskLevel}`}>{predictionResult.riskLevel === 'high' ? '🔴 High Risk' : predictionResult.riskLevel === 'moderate' ? '🟡 Moderate Risk' : '🟢 Low Risk'}</div>
                    <div className="probability-circle"><svg width="120" height="120"><circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8"/><circle cx="60" cy="60" r="50" fill="none" stroke={predictionResult.riskLevel === 'high' ? '#ef4444' : predictionResult.riskLevel === 'moderate' ? '#f59e0b' : '#10b981'} strokeWidth="8" strokeDasharray={`${(predictionResult.probability / 100) * 314} 314`} transform="rotate(-90 60 60)"/></svg><div className="probability-text">{predictionResult.probability}%</div></div>
                    <p><strong>Expected Onset:</strong> {predictionResult.expectedOnset}</p>
                    <div className="actions-list"><strong>Recommended Actions:</strong><ul>{predictionResult.actions.slice(0, 4).map((a, i) => <li key={i}>• {a}</li>)}</ul></div>
                  </div>
                ) : <div className="no-results"><i className="fas fa-chart-line"></i><p>Enter data for AI prediction</p></div>}
              </div>
            </div>
          </div>
        )}

        {/* Chatbot Module */}
        {activeModule === 'chatbot' && (
          <div className="module-content chatbot-module">
            <div className="chatbot-container">
              <div className="chat-messages">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`}>
                    <div className="message-avatar">{msg.role === 'bot' ? '🤖' : '👤'}</div>
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
                {isTyping && <div className="message bot typing"><div className="message-avatar">🤖</div><div className="message-content">AI is thinking...</div></div>}
                <div ref={chatEndRef} />
              </div>
              <div className="quick-questions">
                <button onClick={() => quickQuestion('What are Newcastle disease symptoms?')}>Newcastle symptoms</button>
                <button onClick={() => quickQuestion('How to increase egg production?')}>Increase eggs</button>
                <button onClick={() => quickQuestion('Vaccination schedule')}>Vaccination</button>
              </div>
              <div className="chat-input-area">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type your question..." />
                <button className={`voice-btn ${isListening ? 'listening' : ''}`} onClick={startVoiceInput}><i className="fas fa-microphone"></i></button>
                <button onClick={handleSendMessage}><i className="fas fa-paper-plane"></i> Send</button>
              </div>
            </div>
          </div>
        )}

        {/* Sensors Module */}
        {activeModule === 'sensors' && (
          <div className="module-content">
            <div className="sensors-grid">
              {Object.entries(sensorData).map(([house, data]) => (
                <div key={house} className="sensor-card" style={{ borderTopColor: data.risk === 'high' ? '#ef4444' : data.risk === 'moderate' ? '#f59e0b' : '#10b981' }}>
                  <div className="sensor-header"><h3>House {house}</h3><span className={`sensor-status ${data.risk}`}>{data.risk === 'high' ? 'Critical' : data.risk === 'moderate' ? 'Warning' : 'Normal'}</span></div>
                  <div className="sensor-readings"><div className="sensor-reading"><i className="fas fa-thermometer-half"></i><span>Temperature: <strong>{data.temp}°C</strong></span></div><div className="sensor-reading"><i className="fas fa-tint"></i><span>Humidity: <strong>{data.humidity}%</strong></span></div></div>
                  {data.temp > 33 && <div className="sensor-alert">⚠️ High temperature alert!</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Module */}
        {activeModule === 'learning' && (
          <div className="module-content">
            <div className="learning-grid">
              <div className="stats-section">
                <h3>System Statistics</h3>
                <div className="stats-cards">
                  <div className="stat-card"><div className="stat-icon">📊</div><div><h4>Total Predictions</h4><p className="stat-number">{learningData.totalPredictions}</p></div></div>
                  <div className="stat-card"><div className="stat-icon">🎯</div><div><h4>Accuracy Rate</h4><p className="stat-number">{learningData.accuracyRate}%</p></div></div>
                  <div className="stat-card"><div className="stat-icon">📝</div><div><h4>Farmer Corrections</h4><p className="stat-number">{learningData.farmerCorrections}</p></div></div>
                </div>
              </div>
              <div className="feedback-section">
                <h3>Help AI Learn</h3>
                {!feedbackSubmitted ? (
                  <>
                    <p>Was the AI prediction correct?</p>
                    <div className="feedback-buttons">
                      <button className={`feedback-yes ${feedback.wasCorrect === true ? 'active' : ''}`} onClick={() => setFeedback({ ...feedback, wasCorrect: true })}>✅ Yes</button>
                      <button className={`feedback-no ${feedback.wasCorrect === false ? 'active' : ''}`} onClick={() => setFeedback({ ...feedback, wasCorrect: false })}>❌ No</button>
                    </div>
                    <textarea className="feedback-textarea" rows="2" placeholder="Additional comments..." value={feedback.comments} onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })} />
                    <button className="submit-feedback-btn" onClick={handleFeedbackSubmit}>Submit Feedback</button>
                  </>
                ) : <div className="feedback-success"><i className="fas fa-check-circle"></i><p>Thank you! AI will improve.</p></div>}
              </div>
            </div>
          </div>
        )}

        {/* Advanced AI Module */}
        {activeModule === 'advanced' && (
          <div className="module-content">
            <AdvancedAIFeatures />
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartDashboard;
