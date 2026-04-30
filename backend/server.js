const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://smart-poultry-ai.vercel.app'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Check MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined');
  process.exit(1);
}

// Create admin user if not exists
const createAdminUser = async () => {
  try {
    const User = require('./models/User');
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
};

// MongoDB Connection
mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('✅ MongoDB Connected Successfully');
  await createAdminUser();
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// ============ ROUTES - ALL UNCOMMENTED ============
app.use('/api/auth', require('./routes/auth'));
app.use('/api/farm', require('./routes/farmRoutes'));
// app.use('/api/admin', require('./routes/admin'));  // Uncomment when ready
// app.use('/api/contact', require('./routes/contact'));  // Uncomment when ready
// app.use('/api/company', require('./routes/company'));  // Uncomment when ready

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Poultry AI API is running' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔑 Admin Email: ${process.env.ADMIN_EMAIL || 'admin@poultryai.com'}`);
  console.log(`🔑 Admin Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  console.log(`📊 MongoDB: ${MONGODB_URI ? '✓ Connected' : '✗ Missing'}`);
  console.log(`\n📡 Available routes:`);
  console.log(`   === AUTH ROUTES ===`);
  console.log(`   - POST   /api/auth/register`);
  console.log(`   - POST   /api/auth/login`);
  console.log(`   - GET    /api/auth/profile`);
  console.log(`   - PUT    /api/auth/profile`);
  console.log(`   - POST   /api/auth/upload-profile-pic`);
  console.log(`   - DELETE /api/auth/delete-profile-pic`);
  console.log(`   - GET    /api/auth/stats`);
  console.log(`   - PUT    /api/auth/notifications`);
  console.log(`\n   === FARM ROUTES ===`);
  console.log(`   - GET    /api/farm/farms`);
  console.log(`   - GET    /api/farm/my-farms`);
  console.log(`   - POST   /api/farm/farms`);
  console.log(`   - PUT    /api/farm/farms/:farmId`);
  console.log(`   - DELETE /api/farm/farms/:farmId`);
  console.log(`   - GET    /api/farm/records/:farmId`);
  console.log(`   - POST   /api/farm/records`);
  console.log(`   - GET    /api/farm/suggestions/:farmId`);
  console.log(`\n   === PUBLIC ROUTES ===`);
  console.log(`   - GET    /api/health`);
  console.log(`   - GET    /api/test`);
});