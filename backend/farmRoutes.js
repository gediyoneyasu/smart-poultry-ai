
// ============ AI IMAGE ANALYSIS ENDPOINT ============

const { analyzeImage } = require('../services/imageAnalysisService');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/farm/analyze-image - AI Disease Detection from Image
router.post('/analyze-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    
    // Get image buffer
    const imageBuffer = req.file.buffer;
    
    // Run AI analysis
    const analysis = await analyzeImage(imageBuffer, null);
    
    res.json({
      success: true,
      analysis: analysis
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
