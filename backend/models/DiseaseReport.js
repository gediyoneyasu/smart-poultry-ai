const mongoose = require('mongoose');

const DiseaseReportSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PoultryHouse'
  },
  imageUrl: String,
  imageAnalysis: {
    disease: String,
    confidence: Number,
    symptoms: [String]
  },
  sensorData: {
    temperature: Number,
    humidity: Number,
    feedIntake: Number,
    eggProduction: Number
  },
  aiPrediction: {
    diseaseName: String,
    probability: Number,
    expectedOnset: Date
  },
  recommendations: [String],
  farmerCorrection: {
    wasCorrect: Boolean,
    actualDisease: String,
    feedback: String,
    timestamp: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'false-alarm', 'resolved'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DiseaseReport', DiseaseReportSchema);
