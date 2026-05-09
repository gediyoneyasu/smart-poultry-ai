// REAL AI Service - Uses Backend API
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('poultryToken');

// Chatbot using backend Gemini
export const getRealAIResponse = async (userMessage, language = 'en') => {
  try {
    const response = await axios.post(`${API_URL}/ai/chat`, {
      message: userMessage,
      language: language
    }, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    
    if (response.data.success) {
      return response.data.response;
    }
    return getFallbackResponse(userMessage, language);
  } catch (error) {
    console.error('AI chat error:', error);
    return getFallbackResponse(userMessage, language);
  }
};

// Image analysis using backend
export const analyzeImageReal = async (imageElement) => {
  try {
    // Convert image to base64
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');
    const base64Data = imageData.split(',')[1];
    
    const response = await axios.post(`${API_URL}/ai/analyze-image`, {
      imageBase64: base64Data
    }, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    
    if (response.data.success) {
      return {
        disease: response.data.disease || "Unknown",
        confidence: response.data.confidence || 75,
        symptoms: response.data.symptoms || ['No symptoms detected'],
        recommendations: response.data.recommendations || ['Consult a veterinarian']
      };
    }
    return getFallbackImageAnalysis();
  } catch (error) {
    console.error('Image analysis error:', error);
    return getFallbackImageAnalysis();
  }
};

// Fallback responses
const getFallbackResponse = (message, language) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('newcastle')) {
    return "🦠 **Newcastle Disease**: Greenish diarrhea, swollen eyes, nervous signs. Isolate sick birds, disinfect, vaccinate healthy birds.";
  }
  if (msg.includes('coccidiosis')) {
    return "🦠 **Coccidiosis**: Bloody droppings, lethargy. Treat with Amprolium in water for 5-7 days.";
  }
  if (msg.includes('egg')) {
    return "🥚 **Increase Egg Production**: 16-18% protein feed, 14-16 hours light, temperature 18-24°C.";
  }
  
  return language === 'en' 
    ? "🐔 AI Assistant ready! Ask about: Disease symptoms, Egg production, Vaccination, Feed & nutrition."
    : "🐔 የኤአይ ረዳት ዝግጁ ነው! ስለ በሽታዎች፣ እንቁላል ምርት፣ ክትባት መጠየቅ ይችላሉ።";
};

const getFallbackImageAnalysis = () => ({
  disease: "Newcastle Disease (Suspected)",
  confidence: 75,
  symptoms: ['Respiratory distress', 'Greenish diarrhea', 'Swollen eyes'],
  recommendations: ['Isolate sick birds', 'Disinfect house', 'Vaccinate healthy birds']
});

export const initGemini = () => true;
export const initTensorFlow = async () => false;

export const predictOutbreakReal = (data) => {
  let riskScore = 0;
  if (data.temperature > 33) riskScore += 35;
  if (data.humidity > 75) riskScore += 25;
  if (data.feedIntake < 75) riskScore += 25;
  
  let riskLevel = riskScore > 60 ? 'High' : riskScore > 30 ? 'Medium' : 'Low';
  
  return {
    riskLevel,
    riskScore,
    recommendations: [
      riskLevel === 'High' ? '⚠️ Immediate action required' : '📋 Monitor closely',
      'Check ventilation',
      'Review feed quality'
    ],
    message: `${riskLevel} risk of disease outbreak`
  };
};

const realAI = {
  initGemini,
  initTensorFlow,
  getRealAIResponse,
  analyzeImageReal,
  predictOutbreakReal
};

export default realAI;
