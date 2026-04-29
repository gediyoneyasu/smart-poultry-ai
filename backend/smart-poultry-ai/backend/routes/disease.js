const express = require('express');
const multer = require('multer');
const { analyzeImage, getPrediction, submitFeedback } = require('../controllers/diseaseController');
const auth = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/analyze', upload.single('image'), analyzeImage);
router.post('/predict', auth, getPrediction);
router.post('/feedback', auth, submitFeedback);

module.exports = router;
