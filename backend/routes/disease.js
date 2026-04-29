const express = require('express');
const router = express.Router();
const multer = require('multer');
const { auth } = require('../middleware/auth');
const DiseaseReport = require('../models/DiseaseReport');
const Farm = require('../models/Farm');

const upload = multer({ dest: 'uploads/' });

// Analyze disease (simulated AI)
router.post('/analyze', upload.single('image'), auth, async (req, res) => {
  try {
    const { temperature, humidity, birdAge } = req.body;
    
    // Simulated AI response
    const diseases = [
      { disease: "Newcastle Disease", confidence: 94, symptoms: ["Greenish diarrhea", "Swollen eyes", "Nervous signs"] },
      { disease: "Coccidiosis", confidence: 87, symptoms: ["Bloody droppings", "Lethargy", "Reduced feed intake"] },
      { disease: "Fowl Typhoid", confidence: 76, symptoms: ["Pale comb", "Diarrhea", "Anemia"] }
    ];
    
    const result = diseases[0];
    const recommendations = [
      "Isolate sick birds immediately",
      "Disinfect the poultry house",
      "Add vitamins to drinking water",
      "Contact veterinarian for confirmation"
    ];
    
    // Save report
    const farm = await Farm.findOne({ farmerId: req.user.id });
    const report = new DiseaseReport({
      farmId: farm?._id,
      imageAnalysis: result,
      sensorData: { temperature, humidity },
      recommendations,
      status: 'pending'
    });
    await report.save();
    
    res.json({
      disease: result.disease,
      confidence: result.confidence,
      symptoms: result.symptoms,
      recommendations,
      requiresVet: result.confidence > 80
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's reports
router.get('/reports', auth, async (req, res) => {
  try {
    const farm = await Farm.findOne({ farmerId: req.user.id });
    if (!farm) return res.json([]);
    const reports = await DiseaseReport.find({ farmId: farm._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit feedback
router.post('/feedback', auth, async (req, res) => {
  try {
    const { reportId, wasCorrect, actualDisease, comments } = req.body;
    await DiseaseReport.findByIdAndUpdate(reportId, {
      farmerCorrection: { wasCorrect, actualDisease, feedback: comments, timestamp: new Date() },
      status: wasCorrect ? 'confirmed' : 'false-alarm'
    });
    res.json({ message: 'Feedback recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
