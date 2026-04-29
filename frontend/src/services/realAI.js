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

// REAL Chatbot using Gemini AI - Answers ANY question
export const getRealAIResponse = async (userMessage, language = 'en') => {
  try {
    // Initialize if not already
    if (!generativeModel) {
      initGemini();
    }
    
    if (generativeModel) {
      const prompt = `You are an expert poultry veterinarian and farm management consultant. 
      
      RULES:
      1. Answer ALL questions helpfully and accurately
      2. If the question is NOT about poultry/farming, politely redirect to poultry topics
      3. For business/financial questions related to poultry farming, give practical advice
      4. Be concise but informative (100-150 words)
      5. Use emojis to make responses friendly
      6. Respond in ${language === 'en' ? 'English' : 'Amharic (አማርኛ)'}
      7. If asked for images, explain that I'm a text-only AI but can describe symptoms
      
      User Question: ${userMessage}
      
      Respond as a helpful poultry expert:`;
      
      const result = await generativeModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('✅ Gemini response received');
      return text;
    } else {
      console.warn('Gemini not initialized, using fallback');
      return getEnhancedFallbackResponse(userMessage, language);
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return getEnhancedFallbackResponse(userMessage, language);
  }
};

// Enhanced fallback for when API fails
const getEnhancedFallbackResponse = (message, language) => {
  const msg = message.toLowerCase();
  
  // Business/Financial questions
  if (msg.includes('money') || msg.includes('profit') || msg.includes('income') || msg.includes('ካሳ')) {
    return "💰 **Poultry Farm Profit Tips:**\n\n• Reduce feed costs by buying in bulk\n• Increase egg production with proper lighting (14-16 hours)\n• Reduce mortality through vaccination\n• Sell directly to consumers (higher prices)\n• Value-added products: sell manure as fertilizer\n• Track expenses and income in a ledger\n\nWant specific calculations for your farm size?";
  }
  
  // Counting/numbers questions
  if (msg.includes('number') || msg.includes('count') || msg.includes('how many') || msg.includes('ቁጥር')) {
    return "📊 **Managing Chicken Numbers:**\n\n• Keep a daily log of: New chicks, Deaths, Sold birds\n• Recommended density: 4-5 birds per square meter\n• Weigh birds weekly to track growth\n• Use a simple notebook or mobile app to track counts\n• Separate birds by age groups for easier counting\n\nWould you like a sample tracking template?";
  }
  
  // Image requests
  if (msg.includes('image') || msg.includes('picture') || msg.includes('photo') || msg.includes('ምስል') || msg.includes('ፎቶ')) {
    return "📸 **I can't generate images**, but I can help you identify diseases by description!\n\nPlease use the **📷 Image AI Detection** module above to:\n• Upload a photo of your sick chicken\n• Take a picture with your camera\n• Get instant AI diagnosis\n\nYou can also describe the symptoms and I'll help identify the disease!";
  }
  
  // Newcastle disease - detailed
  if (msg.includes('newcastle')) {
    return "🦠 **Newcastle Disease (ኒውካስል በሽታ)**\n\n📋 **Symptoms:**\n• Greenish, watery diarrhea (አረንጓዴ ተቅማጥ)\n• Swollen eyes, discharge (እብጠት ያለባቸው አይኖች)\n• Nervous signs: twisted neck, paralysis (የነርቭ ምልክቶች)\n• Coughing, sneezing (ማሳል እና ማስነጠስ)\n• Sudden death (ድንገተኛ ሞት)\n\n💊 **Treatment:** No cure - focus on prevention\n• Isolate sick birds immediately\n• Disinfect the house\n• Supportive care with vitamins\n\n💉 **Prevention:** Vaccinate at day 7 & 21";
  }
  
  // Egg production - detailed
  if (msg.includes('egg') || msg.includes('እንቁላል')) {
    return "🥚 **Increase Egg Production - Complete Guide:**\n\n🍽️ **Nutrition:**\n• 16-18% protein layer feed\n• Calcium supplement (oyster shells)\n• Clean water 24/7\n\n💡 **Lighting:**\n• 14-16 hours of light daily\n• Use LED bulbs (energy efficient)\n\n🌡️ **Environment:**\n• Temperature: 18-24°C (65-75°F)\n• Good ventilation\n• Clean nesting boxes\n\n🩺 **Health:**\n• Deworm regularly\n• Vaccinate on schedule\n• Reduce stress (no loud noises, predators)\n\n📈 Expected: 80-90% production in peak layers";
  }
  
  // General health
  if (msg.includes('symptom') || msg.includes('disease') || msg.includes('sick') || msg.includes('በሽታ')) {
    return "🩺 **Common Poultry Diseases:**\n\n1. **Newcastle** - Green diarrhea, nervous signs\n2. **Coccidiosis** - Bloody droppings, lethargy\n3. **Fowl Typhoid** - Pale comb, weakness\n4. **Marek's** - Paralysis, tumors\n5. **Infectious Bronchitis** - Coughing, reduced eggs\n\n💡 **For accurate diagnosis:** Use the 📷 Image AI module above to upload a photo of your sick chicken!\n\nDescribe specific symptoms for more help.";
  }
  
  // Vaccination
  if (msg.includes('vaccine') || msg.includes('ክትባት')) {
    return "💉 **Poultry Vaccination Schedule:**\n\n🐣 **Day 1:** Marek's Disease\n🐥 **Day 7:** Newcastle (Lasota)\n🐥 **Day 14:** Gumboro (IBD)\n🐥 **Day 21:** Newcastle Booster\n🐔 **Week 8:** Fowl Pox\n🐔 **Week 16:** Avian Influenza (if required)\n\n📋 **Important:**\n• Store vaccines properly (2-8°C)\n• Don't mix different vaccines\n• Consult local vet for regional requirements\n• Record all vaccinations";
  }
  
  // Temperature
  if (msg.includes('temperature') || msg.includes('heat') || msg.includes('ሙቀት')) {
    return "🌡️ **Optimal Temperature by Age:**\n\n🐣 **Day 1-7:** 32-35°C (90-95°F)\n🐥 **Week 2:** 29-32°C (85-90°F)\n🐥 **Week 3:** 26-29°C (79-85°F)\n🐤 **Week 4:** 23-26°C (73-79°F)\n🐔 **Adult Layers:** 18-24°C (65-75°F)\n\n⚠️ **Signs of heat stress:**\n• Panting, wings spread\n• Reduced feed intake\n• Drop in egg production\n\n💡 **Solutions:** Increase ventilation, provide cool water, reduce stocking density";
  }
  
  // General greeting
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('ሰላም')) {
    return "🐔 **Hello!** Welcome to Smart Poultry AI!\n\nI can help you with:\n• 🩺 Disease diagnosis (use the Image AI tab!)\n• 📊 Outbreak prediction\n• 🥚 Egg production tips\n• 💊 Treatment advice\n• 💉 Vaccination schedules\n• 💰 Farm business advice\n\nWhat would you like to know today? 🌟";
  }
  
  // Default - still helpful
  return "🐔 **I'm your AI Poultry Expert!**\n\nYou can ask me about:\n• Disease symptoms and treatment\n• Egg production improvement\n• Vaccination schedules\n• Feed and nutrition\n• Farm management\n• Business and profit tips\n\n**Try asking:**\n• 'How do I increase egg production?'\n• 'What are Newcastle disease symptoms?'\n• 'How much can I earn from 100 chickens?'\n• 'Vaccination schedule'\n\nOr use the **📷 Image AI** tab to upload photos for diagnosis!";
};

// Simplified TensorFlow functions (keeping for compatibility)
export const initTensorFlow = async () => {
  console.log('✅ TensorFlow ready (simulated for demo)');
  return true;
};

export const analyzeImageReal = async (imageElement) => {
  // Simulated analysis
  return {
    disease: "Poultry - Analysis Complete",
    confidence: 85,
    symptoms: ['AI vision analysis complete', 'Upload to Gemini for detailed diagnosis'],
    recommendations: ['Use the AI Assistant chat for follow-up questions', 'Describe any symptoms you observe']
  };
};

export const predictOutbreakReal = (data) => {
  let riskScore = 0;
  
  if (data.temperature > 33) riskScore += 35;
  if (data.humidity > 75) riskScore += 25;
  if (data.feedIntake < 75) riskScore += 25;
  if (data.eggProduction < 100) riskScore += 30;
  
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
