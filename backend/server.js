const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://smart-poultry-ai.vercel.app', process.env.FRONTEND_URL],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Check MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  console.error('Please set MONGODB_URI in your Render environment variables');
  process.exit(1);
}

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  createAdminUser();
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.error('Please check your MONGODB_URI:');
  console.error('Expected format: mongodb+srv://username:password@cluster.mongodb.net/database');
});

// Create admin user if not exists
const createAdminUser = async () => {
  try {
    const User = require('./models/User');
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const admin = new User({
        name: 'Admin',
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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/farm', require('./routes/farmRoutes'));
app.use('/api/contact', require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Poultry AI API is running' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}`);
  console.log(`🔑 Admin Email: ${process.env.ADMIN_EMAIL || 'admin@poultryai.com'}`);
  console.log(`🔑 Admin Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  console.log(`📊 MongoDB URI: ${MONGODB_URI ? '✓ Set' : '✗ Missing'}`);
});
