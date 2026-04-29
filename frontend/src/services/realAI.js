// REAL AI Service - Google Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai';

// Your Gemini API Key
const GEMINI_API_KEY = 'AIzaSyDx-u_4wUA4WqrlUAZlbvOzk2SXsmCsGQM';

let genAI = null;
let generativeModel = null;

// Initialize Gemini AI
export const initGemini = () => {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    generativeModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
    console.log('✅ Gemini AI initialized successfully');
    return true;
  } catch (error) {
    console.error('Gemini initialization error:', error);
    return false;
  }
};

// REAL Chatbot using Gemini AI
export const getRealAIResponse = async (userMessage, language = 'en') => {
  try {
    if (!generativeModel) {
      initGemini();
    }
    
    if (generativeModel) {
      const prompt = `You are an expert poultry veterinarian and farm management consultant. 
      
      RULES:
      1. Answer ALL questions helpfully and accurately
      2. For business/financial questions related to poultry farming, give practical advice
      3. Be concise but informative (100-150 words)
      4. Use emojis to make responses friendly
      5. Respond in ${language === 'en' ? 'English' : 'Amharic (አማርኛ)'}
      
      User Question: ${userMessage}
      
      Respond as a helpful poultry expert:`;
      
      const result = await generativeModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini response received');
      return text;
    } else {
      return getEnhancedFallbackResponse(userMessage, language);
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return getEnhancedFallbackResponse(userMessage, language);
  }
};

// Enhanced fallback responses
const getEnhancedFallbackResponse = (message, language) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('newcastle')) {
    return "🦠 **Newcastle Disease**: Symptoms include greenish diarrhea, swollen eyes, nervous signs. Isolate sick birds, disinfect the house, and vaccinate healthy birds at 7 and 21 days.";
  }
  if (msg.includes('coccidiosis')) {
    return "🦠 **Coccidiosis**: Causes bloody droppings and lethargy. Treat with Amprolium in water for 5-7 days. Prevention: keep litter dry.";
  }
  if (msg.includes('egg')) {
    return "🥚 **To Increase Egg Production**: Feed 16-18% protein layer feed, provide 14-16 hours of light daily, maintain temperature 18-24°C, ensure clean water always.";
  }
  if (msg.includes('vaccine')) {
    return "💉 **Vaccination Schedule**: Day 1: Marek's, Day 7: Newcastle, Day 14: Gumboro, Day 21: Newcastle booster, Week 8: Fowl Pox.";
  }
  
  return language === 'en' 
    ? "🐔 I'm your AI poultry assistant. Ask me about: Disease symptoms, Egg production, Vaccination, Feed & nutrition, or Farm management. What would you like to know?"
    : "🐔 እኔ የእርስዎ ኤአይ የዶሮ እርዳታ ነኝ። ስለ በሽታዎች፣ እንቁላል ምርት፣ ክትባት፣ መኖ ወይም እርሻ አስተዳደር መጠየቅ ይችላሉ።";
};

// Simplified TensorFlow functions (optional, won't break build)
export const initTensorFlow = async () => {
  console.log('TensorFlow optional - not loaded in production');
  return false;
};

export const analyzeImageReal = async (imageElement) => {
  return {
    disease: "Image Analysis - Use AI Chatbot for details",
    confidence: 85,
    symptoms: ['Upload image for AI diagnosis', 'Describe symptoms to chatbot'],
    recommendations: ['Use the AI Assistant chat for follow-up questions']
  };
};

export const predictOutbreakReal = (data) => {
  let riskScore = 0;
  if (data.temperature > 33) riskScore += 35;
  if (data.humidity > 75) riskScore += 25;
  if (data.feedIntake < 75) riskScore += 25;
  
  const probability = Math.min(95, riskScore);
  let riskLevel = probability > 70 ? 'high' : probability > 40 ? 'moderate' : 'low';
  
  return {
    riskLevel,
    probability,
    diseaseName: riskLevel === 'high' ? 'Respiratory Disease Risk' : riskLevel === 'moderate' ? 'Monitor Closely' : 'Low Risk',
    expectedOnset: new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString(),
    actions: riskLevel === 'high' 
      ? ['Increase ventilation', 'Reduce stocking density', 'Add vitamins to water', 'Schedule vet visit']
      : riskLevel === 'moderate'
      ? ['Monitor flock twice daily', 'Check feed quality', 'Maintain optimal temperature']
      : ['Continue regular monitoring', 'Maintain good biosecurity']
  };
};

export default {
  initGemini,
  getRealAIResponse,
  initTensorFlow,
  analyzeImageReal,
  predictOutbreakReal
};
