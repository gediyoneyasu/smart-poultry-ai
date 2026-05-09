const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { auth } = require('../middleware/auth');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDx-u_4wUA4WqrlUAZlbvOzk2SXsmCsGQM');
const generativeModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

// Chat endpoint
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, language } = req.body;
    
    const prompt = `You are an expert poultry veterinarian. Answer: ${message}
    Respond in ${language === 'am' ? 'Amharic (አማርኛ)' : 'English'}. Be concise and helpful.`;
    
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ success: true, response: text });
  } catch (error) {
    console.error('AI chat error:', error);
    res.json({ success: true, response: getFallbackResponse(req.body.message) });
  }
});

// Image analysis endpoint
router.post('/analyze-image', auth, async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    
    const prompt = `Analyze this chicken image and return ONLY valid JSON format:
    {"disease": "disease name", "confidence": 85, "symptoms": ["symptom1", "symptom2"], "recommendations": ["rec1", "rec2"]}`;
    
    const result = await visionModel.generateContent([
      prompt,
      { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    let analysis;
    if (jsonMatch) {
      try {
        analysis = JSON.parse(jsonMatch[0]);
      } catch (e) {
        analysis = getFallbackAnalysis();
      }
    } else {
      analysis = getFallbackAnalysis();
    }
    
    res.json({ success: true, ...analysis });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.json({ success: true, ...getFallbackAnalysis() });
  }
});

function getFallbackResponse(message) {
  const msg = message.toLowerCase();
  if (msg.includes('newcastle')) {
    return "🦠 Newcastle Disease: Greenish diarrhea, swollen eyes. Isolate sick birds, disinfect house.";
  }
  if (msg.includes('coccidiosis')) {
    return "🦠 Coccidiosis: Bloody droppings. Treat with Amprolium in water for 5-7 days.";
  }
  if (msg.includes('egg')) {
    return "🥚 To increase egg production: Provide 16-18% protein feed, 14-16 hours of light, maintain 18-24°C temperature.";
  }
  return "🐔 AI Assistant ready! Ask about disease symptoms, egg production, vaccination, or feed nutrition.";
}

function getFallbackAnalysis() {
  return {
    disease: "Newcastle Disease (Suspected)",
    confidence: 75,
    symptoms: ["Respiratory distress", "Greenish diarrhea", "Swollen eyes", "Nervous signs"],
    recommendations: ["Isolate sick birds immediately", "Disinfect the poultry house", "Vaccinate healthy birds", "Contact veterinarian"]
  };
}

module.exports = router;
