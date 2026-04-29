const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  createAdminUser();
})
.catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// Create admin user if not exists
const createAdminUser = async () => {
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
  }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/farm', require('./routes/farm'));
app.use('/api/disease', require('./routes/disease'));
app.use('/api/contact', require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Poultry AI API is running' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}`);
  console.log(`🔑 Admin Email: ${process.env.ADMIN_EMAIL}`);
  console.log(`🔑 Admin Password: ${process.env.ADMIN_PASSWORD}`);
});

// Farm routes
app.use('/api/farm', require('./routes/farmRoutes'));

// Farm routes
app.use('/api/farm', require('./routes/farmRoutes'));
