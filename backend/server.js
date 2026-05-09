require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://smart-poultry-ai.vercel.app'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// ============ ROUTES ============
app.use('/api/auth', require('./routes/auth'));
app.use('/api/farm', require('./routes/farmRoutes'));
app.use('/api/company', require('./routes/company'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ai', require('./routes/ai'));

// ============ HEALTH CHECKS ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Poultry AI API is running' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// ============ ERROR HANDLERS ============
app.use('*', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log('✅ Routes: /api/auth, /api/farm, /api/company, /api/contact, /api/admin, /api/ai');
});
