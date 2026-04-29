const DiseaseReport = require('../models/DiseaseReport');
const imageAnalysisService = require('../services/imageAnalysisService');
const predictionService = require('../services/predictionService');

exports.analyzeImage = async (req, res) => {
  try {
    const { temperature, humidity, birdAge, feedIntake } = req.body;
    const imageFile = req.file;
    
    if (!imageFile) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    // Analyze image
    const imageResult = await imageAnalysisService.analyzeImage(imageFile.buffer, {
      temperature,
      humidity,
      birdAge
    });
    
    // Get sensor data for multi-modal analysis
    const sensorData = { temperature: parseFloat(temperature), humidity: parseFloat(humidity) };
    
    // Multi-modal analysis
    const finalResult = predictionService.analyzeMultiModal(imageResult, sensorData, birdAge);
    
    // Generate recommendations
    const recommendations = predictionService.generateRecommendations(
      finalResult.disease,
      finalResult.confidence,
      sensorData
    );
    
    res.json({
      disease: finalResult.disease,
      confidence: finalResult.confidence,
      symptoms: finalResult.symptoms,
      recommendations: recommendations,
      sensorData: sensorData,
      requiresVet: finalResult.confidence > 80
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPrediction = async (req, res) => {
  try {
    const { farmId, sensorData } = req.body;
    
    // Get recent sensor history (simulated)
    const sensorHistory = [
      { temperature: 31.2, eggCount: 145 },
      { temperature: 32.5, eggCount: 138 },
      { temperature: 33.8, eggCount: 124 },
      { temperature: 34.5, eggCount: 112 },
      { temperature: sensorData?.temperature || 34.2, eggCount: sensorData?.eggCount || 108 }
    ];
    
    const prediction = await predictionService.predictOutbreak(sensorHistory);
    const recommendations = predictionService.generateRecommendations(
      prediction.diseaseName,
      prediction.probability,
      { temperature: sensorData?.temperature || 34 }
    );
    
    res.json({
      ...prediction,
      recommendations
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const { reportId, wasCorrect, actualDisease, comments } = req.body;
    
    // In production, update the report and trigger model retraining
    console.log(`Feedback received: ${wasCorrect ? 'Correct' : 'Wrong'} - ${actualDisease}`);
    
    res.json({
      message: 'Feedback recorded successfully',
      willRetrain: true,
      retrainSchedule: 'Weekly model update'
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
