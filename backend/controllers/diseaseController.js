exports.analyzeImage = async (req, res) => {
  res.json({
    disease: 'Newcastle Disease',
    confidence: 94,
    symptoms: ['Greenish diarrhea', 'Swollen eyes'],
    recommendations: ['Isolate sick birds', 'Contact veterinarian'],
    requiresVet: true
  });
};
exports.getPrediction = async (req, res) => {
  res.json({ diseaseName: 'Respiratory Disease', probability: 78 });
};
