#!/bin/bash

echo "========================================="
echo "🐔 SMART POULTRY AI - PROJECT SETUP"
echo "========================================="

# Create backend structure
echo "📁 Creating backend folders..."
mkdir -p backend/models backend/routes backend/controllers backend/middleware backend/services backend/uploads

# Create model files
echo "📄 Creating model files..."
cat > backend/models/User.js << 'EOF'
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['farmer', 'vet', 'admin'], default: 'farmer' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
EOF

cat > backend/models/Farm.js << 'EOF'
const mongoose = require('mongoose');
const FarmSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmName: { type: String, required: true },
  location: { region: String, zone: String, woreda: String },
  totalBirds: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Farm', FarmSchema);
EOF

cat > backend/models/DiseaseReport.js << 'EOF'
const mongoose = require('mongoose');
const DiseaseReportSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  imageUrl: String,
  imageAnalysis: { disease: String, confidence: Number, symptoms: [String] },
  recommendations: [String],
  status: { type: String, enum: ['pending', 'confirmed', 'resolved'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('DiseaseReport', DiseaseReportSchema);
EOF

cat > backend/models/SensorData.js << 'EOF'
const mongoose = require('mongoose');
const SensorDataSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  house: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
  temperature: Number,
  humidity: Number,
  eggCount: Number,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('SensorData', SensorDataSchema);
EOF

cat > backend/models/ChatHistory.js << 'EOF'
const mongoose = require('mongoose');
const ChatHistorySchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  messages: [{ role: String, content: String, timestamp: Date }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
EOF

# Create route files
echo "📄 Creating route files..."
cat > backend/routes/auth.js << 'EOF'
const express = require('express');
const router = express.Router();
router.post('/register', (req, res) => res.json({ message: 'Register endpoint' }));
router.post('/login', (req, res) => res.json({ message: 'Login successful', token: 'demo-token' }));
module.exports = router;
EOF

cat > backend/routes/disease.js << 'EOF'
const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/analyze', upload.single('image'), (req, res) => {
  const diseases = ['Newcastle Disease', 'Coccidiosis', 'Fowl Typhoid'];
  res.json({
    disease: diseases[0],
    confidence: 94,
    symptoms: ['Greenish diarrhea', 'Swollen eyes', 'Nervous signs'],
    recommendations: ['Isolate sick birds', 'Disinfect house', 'Add vitamins to water'],
    requiresVet: true
  });
});

router.post('/predict', (req, res) => {
  res.json({
    diseaseName: 'Respiratory Disease Risk',
    probability: 78,
    expectedOnset: new Date(),
    recommendations: ['Increase ventilation', 'Reduce stocking density']
  });
});

module.exports = router;
EOF

cat > backend/routes/farm.js << 'EOF'
const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Farm routes' }));
module.exports = router;
EOF

cat > backend/routes/sensor.js << 'EOF'
const express = require('express');
const router = express.Router();
router.post('/data', (req, res) => res.json({ message: 'Sensor data received' }));
module.exports = router;
EOF

cat > backend/routes/chat.js << 'EOF'
const express = require('express');
const router = express.Router();
router.post('/message', (req, res) => res.json({ reply: 'How can I help with your poultry farm?' }));
module.exports = router;
EOF

# Create controller files
echo "📄 Creating controller files..."
cat > backend/controllers/diseaseController.js << 'EOF'
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
EOF

echo "exports.dummy = (req, res) => res.json({ message: 'OK' });" > backend/controllers/authController.js
echo "exports.dummy = (req, res) => res.json({ message: 'OK' });" > backend/controllers/farmController.js
echo "exports.dummy = (req, res) => res.json({ message: 'OK' });" > backend/controllers/sensorController.js
echo "exports.dummy = (req, res) => res.json({ message: 'OK' });" > backend/controllers/chatController.js

# Create middleware
echo "module.exports = (req, res, next) => next();" > backend/middleware/auth.js

# Create services
echo "class PredictionService {} module.exports = new PredictionService();" > backend/services/predictionService.js
echo "class ImageAnalysisService {} module.exports = new ImageAnalysisService();" > backend/services/imageAnalysisService.js

# Create .env file
cat > backend/.env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/poultry-ai
JWT_SECRET=my_secret_key
EOF

# Create server.js
cat > backend/server.js << 'EOF'
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection (optional - will work even if MongoDB not installed)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('⚠️ MongoDB not running, starting without DB'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/farm', require('./routes/farm'));
app.use('/api/disease', require('./routes/disease'));
app.use('/api/sensor', require('./routes/sensor'));
app.use('/api/chat', require('./routes/chat'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Smart Poultry AI API' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API ready: http://localhost:${PORT}/api/health`);
});
EOF

# Create package.json
cat > backend/package.json << 'EOF'
{
  "name": "smart-poultry-ai-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
EOF

echo ""
echo "✅ Backend created successfully!"
echo ""
echo "🚀 TO START:"
echo "   cd backend"
echo "   npm install"
echo "   npm run dev"
echo ""
