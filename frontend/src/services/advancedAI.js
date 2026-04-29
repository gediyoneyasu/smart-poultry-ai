// Advanced AI Capabilities Service with Amharic Voice Support

// Voice synthesis with Amharic support
export const speakText = (text, language = 'en') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return false;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language and find appropriate voice
  if (language === 'am') {
    utterance.lang = 'am-ET';
    // Try to find Amharic voice
    const voices = window.speechSynthesis.getVoices();
    const amharicVoice = voices.find(voice => 
      voice.lang.includes('am') || 
      voice.lang.includes('ET') ||
      voice.name.includes('Amharic') ||
      voice.name.includes('Ethiopia')
    );
    if (amharicVoice) {
      utterance.voice = amharicVoice;
    }
  } else {
    utterance.lang = 'en-US';
  }
  
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  window.speechSynthesis.speak(utterance);
  return true;
};

// Pre-defined Amharic messages
export const getAmharicMessage = (type) => {
  const messages = {
    greeting: "እንኳን ደህና መጡ! እኔ የእርስዎ ኤአይ የዶሮ እርዳታ ነኝ። እንዴት ልረዳዎ እችላለሁ?",
    healthGood: "የእርስዎ ዶሮዎች ጤናማ ናቸው። መደበኛ ክትትል ይቀጥሉ።",
    healthAlert: "ማስጠንቀቂያ! ከፍተኛ የሙቀት መጠን ተገኝቷል። እባክዎ አየር ማናፈሻ ይጨምሩ።",
    diseaseDetected: "በሽታ ተገኝቷል! እባክዎ ወዲያውኑ የእንስሳት ሐኪም ይደውሉ።",
    eggProduction: "የእንቁላል ምርትን ለማሳደግ በቂ ብርሃን እና ንጹህ ውሃ ይስጡ።",
    vaccineReminder: "የክትባት ጊዜ ቀርቧል። እባክዎ ዶሮዎችዎን እንዲከተቡ ያስታውሱ።",
    maintenanceAlert: "የአየር ማናፈሻ ስርዓት ጥገና ያስፈልገዋል። እባክዎ ወዲያውኑ ይመልከቱ።",
    weatherAlert: "ከፍተኛ ሙቀት ሊከሰት ነው። ለዶሮዎችዎ በቂ ውሃ እና ጥላ ይስጡ።"
  };
  return messages[type] || messages.greeting;
};

export const analyzeVideoFrame = async (videoElement) => {
  return {
    timestamp: new Date(),
    birdCount: Math.floor(Math.random() * 20) + 10,
    abnormalMovements: Math.random() > 0.7 ? ['Limping detected', 'Head shaking'] : [],
    estimatedHealthScore: Math.floor(Math.random() * 30) + 70,
    recommendations: 'Continue monitoring for unusual behavior',
    amharicMessage: getAmharicMessage('healthGood')
  };
};

export const predictMaintenanceNeeds = (equipmentData) => {
  const { temperature, runtimeHours, vibration, noiseLevel } = equipmentData;
  let risks = [];
  let urgency = 'low';
  let recommendations = [];
  let amharicAlert = null;
  
  if (temperature > 35 || runtimeHours > 5000) {
    risks.push('Ventilation system at risk');
    urgency = 'high';
    recommendations.push('Schedule fan maintenance immediately');
    recommendations.push('Clean ventilation ducts');
    amharicAlert = getAmharicMessage('maintenanceAlert');
  }
  
  if (vibration > 0.7) {
    risks.push('Feeder motor vibration detected');
    urgency = 'medium';
    recommendations.push('Check feeder alignment');
    recommendations.push('Lubricate moving parts');
  }
  
  if (noiseLevel > 60) {
    risks.push('Water pump unusual noise');
    urgency = 'medium';
    recommendations.push('Inspect water pump bearings');
  }
  
  return {
    equipment: 'Poultry House Systems',
    overallHealth: urgency === 'high' ? 'Critical' : urgency === 'medium' ? 'Warning' : 'Good',
    risks,
    urgency,
    recommendations,
    estimatedTimeToFailure: urgency === 'high' ? '1-2 weeks' : urgency === 'medium' ? '1-3 months' : '6+ months',
    nextMaintenanceDate: new Date(Date.now() + (urgency === 'high' ? 7 : 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    amharicMessage: amharicAlert || getAmharicMessage('healthGood')
  };
};

export const generateTreatmentPlan = (disease, severity, birdAge, flockSize) => {
  const treatments = {
    'Newcastle Disease': {
      medication: 'No specific cure - supportive care',
      dosage: 'Vitamins and electrolytes in drinking water for 7-10 days',
      isolation: 'Isolate all sick birds immediately',
      supportive: ['Increase ventilation', 'Reduce stocking density', 'Clean and disinfect daily'],
      recoveryTime: '5-14 days',
      amharicName: 'ኒውካስል በሽታ'
    },
    'Coccidiosis': {
      medication: 'Amprolium (Corid)',
      dosage: '10ml per gallon of water for 5-7 days',
      isolation: 'Keep environment clean',
      supportive: ['Keep litter dry', 'Add Vitamin A & K to feed', 'Reduce stress'],
      recoveryTime: '3-5 days',
      amharicName: 'ኮክሲዲዮሲስ'
    },
    'Fowl Pox': {
      medication: 'No specific cure - antibiotics for secondary infections',
      dosage: 'As prescribed by vet for 5-7 days',
      isolation: 'Isolate affected birds',
      supportive: ['Apply iodine to lesions', 'Soft food if mouth lesions', 'Separate by severity'],
      recoveryTime: '2-4 weeks',
      amharicName: 'የዶሮ ፖክስ'
    }
  };
  
  const treatment = treatments[disease] || treatments['Newcastle Disease'];
  
  return {
    disease,
    severity,
    amharicDisease: treatment.amharicName,
    treatmentPlan: {
      immediate: treatment.isolation,
      medication: treatment.medication,
      dosage: treatment.dosage,
      supportiveCare: treatment.supportive,
      timeline: treatment.recoveryTime,
      vetContact: severity === 'high' ? 'Required immediately' : 'Recommended'
    },
    estimatedCost: `ETB ${Math.ceil(flockSize / 100 * 150)} - ETB ${Math.ceil(flockSize / 100 * 250)}`,
    successRate: severity === 'high' ? '60-70%' : severity === 'medium' ? '75-85%' : '90-95%',
    amharicMessage: `ለ${treatment.amharicName} የህክምና እቅድ ተዘጋጅቷል። እባክዎ የታመሙ ዶሮዎችን ያግልሉ እና መድሀኒት ይስጡ።`
  };
};

export const getWeatherForecast = async () => {
  return {
    current: { temp: 28.5, humidity: 65, windSpeed: 12, condition: 'Partly Cloudy' },
    forecast: [
      { day: 'Today', temp: 28, humidity: 65, risk: 'low' },
      { day: 'Tomorrow', temp: 32, humidity: 70, risk: 'high' },
      { day: 'Day 3', temp: 30, humidity: 68, risk: 'medium' },
      { day: 'Day 4', temp: 27, humidity: 60, risk: 'low' },
      { day: 'Day 5', temp: 25, humidity: 55, risk: 'low' }
    ]
  };
};

export const predictOutbreakFromWeather = (weatherData, flockHealth) => {
  let riskScore = 0;
  let factors = [];
  
  if (weatherData.current.temp > 30) {
    riskScore += 30;
    factors.push('High temperature increases heat stress risk');
  }
  
  if (weatherData.current.humidity > 70) {
    riskScore += 25;
    factors.push('High humidity promotes bacterial growth');
  }
  
  if (flockHealth < 80) {
    riskScore += 20;
    factors.push('Flock health below optimal');
  }
  
  const probability = Math.min(95, riskScore);
  const riskLevel = probability > 60 ? 'high' : probability > 30 ? 'moderate' : 'low';
  
  return {
    riskLevel,
    probability,
    contributingFactors: factors,
    recommendations: probability > 60 ? [
      'Increase ventilation',
      'Provide extra water stations',
      'Reduce stocking density',
      'Add electrolytes to water'
    ] : probability > 30 ? [
      'Monitor closely',
      'Check ventilation systems'
    ] : [
      'Continue normal operations'
    ],
    weatherAlert: weatherData.current.temp > 30 ? 'Heat warning: Ensure adequate cooling' : null,
    amharicMessage: probability > 60 ? getAmharicMessage('weatherAlert') : getAmharicMessage('healthGood')
  };
};

// Speak in Amharic function
export const speakAmharic = (messageKey) => {
  const message = getAmharicMessage(messageKey);
  speakText(message, 'am');
  return message;
};

export default {
  speakText,
  speakAmharic,
  getAmharicMessage,
  analyzeVideoFrame,
  predictMaintenanceNeeds,
  generateTreatmentPlan,
  getWeatherForecast,
  predictOutbreakFromWeather
};
