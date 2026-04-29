// AI Prediction Service - Simulates LSTM model predictions
class PredictionService {
  
  // Predict disease outbreak based on sensor data trends
  async predictOutbreak(sensorHistory) {
    // Simulate AI prediction logic
    const lastTemp = sensorHistory[sensorHistory.length - 1]?.temperature || 34.5;
    const lastEggDrop = sensorHistory[sensorHistory.length - 1]?.eggCount || 100;
    
    let probability = 0;
    let diseaseName = "None";
    
    // Rule-based prediction (in production, use actual LSTM model)
    if (lastTemp > 33) {
      probability += 40;
      diseaseName = "Heat Stress";
    }
    if (lastEggDrop < 120) {
      probability += 30;
      diseaseName = "Egg Drop Syndrome";
    }
    if (lastTemp > 33 && lastEggDrop < 120) {
      probability += 20;
      diseaseName = "Respiratory Disease";
    }
    
    probability = Math.min(probability, 95);
    
    return {
      diseaseName,
      probability,
      expectedOnset: new Date(Date.now() + 48 * 60 * 60 * 1000),
      confidence: probability > 70 ? "High" : probability > 40 ? "Medium" : "Low"
    };
  }
  
  // Generate recommendations based on prediction
  generateRecommendations(disease, probability, sensorData) {
    const recommendations = [];
    
    if (disease === "Respiratory Disease" || probability > 70) {
      recommendations.push("Isolate sick birds immediately");
      recommendations.push("Increase ventilation in the poultry house");
      recommendations.push("Add vitamins to drinking water");
      recommendations.push("Contact veterinarian for emergency consultation");
    }
    
    if (sensorData.temperature > 33) {
      recommendations.push("Install fans or reduce stocking density");
      recommendations.push("Provide cool, clean drinking water");
    }
    
    if (sensorData.humidity > 70) {
      recommendations.push("Improve drainage and reduce moisture");
      recommendations.push("Change bedding material");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Continue regular monitoring");
      recommendations.push("Maintain proper biosecurity measures");
    }
    
    return recommendations;
  }
  
  // Analyze multiple inputs for smarter detection
  analyzeMultiModal(imageResult, sensorData, birdAge) {
    let confidence = imageResult.confidence;
    let disease = imageResult.disease;
    
    // Adjust confidence based on sensor data
    if (sensorData.temperature > 34 && disease === "Respiratory Disease") {
      confidence += 15;
    }
    if (birdAge < 8 && disease === "Newcastle") {
      confidence += 10;
    }
    
    return {
      ...imageResult,
      confidence: Math.min(confidence, 99),
      enhancedBy: "multi-modal analysis"
    };
  }
}

module.exports = new PredictionService();
