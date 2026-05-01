const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Company = require('../models/Company');
const { auth } = require('../middleware/auth');
const { cloudinary, upload, uploadToCloudinary } = require('../config/cloudinary');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// ============ REGULAR REGISTRATION & LOGIN ============

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, farmName } = req.body;
    console.log('Registration attempt:', { name, email, role, farmName });
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = new User({ 
      name, 
      email, 
      password, 
      phone, 
      role: role || 'farmer',
      farmName: farmName || '',
      farms: farmName ? [{ name: farmName, totalBirds: 0 }] : []
    });
    
    console.log('Saving user...');
    await user.save();
    console.log('User saved successfully');
    
    const token = generateToken(user);
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture,
        bio: user.bio,
        address: user.address,
        farms: user.farms,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture,
        bio: user.bio,
        address: user.address,
        farms: user.farms,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ COMPANY REGISTRATION & LOGIN ============

// Company Registration
router.post('/company-register', async (req, res) => {
  try {
    const { name, email, phone, companyName, username, password } = req.body;
    
    console.log('Company registration attempt:', { name, email, companyName, username });
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or username' });
    }
    
    // Create user
    const user = new User({ 
      name, 
      email, 
      phone: phone || '',
      username,
      password, 
      role: 'company_admin',
      farmName: companyName
    });
    
    await user.save();
    console.log('Company user saved:', user._id);
    
    // Create company
    const company = new Company({
      name: companyName,
      ownerId: user._id,
      createdAt: new Date()
    });
    await company.save();
    console.log('Company created:', company._id);
    
    // Update user with company reference
    user.ownedCompanyId = company._id;
    await user.save();
    
    // Generate token
    const token = generateToken(user);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Company register error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Company Login
router.post('/company-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Company login attempt:', { username });
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    if (user.role !== 'company_admin') {
      return res.status(401).json({ message: 'This account does not have company access' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    const token = generateToken(user);
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        phone: user.phone,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Company login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ PROFILE & USER MANAGEMENT ============

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, bio, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, bio, address, updatedAt: new Date() },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload profile picture
router.post('/upload-profile-pic', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    const result = await uploadToCloudinary(req.file.buffer, 'poultry-ai/profiles');
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: result.secure_url, updatedAt: new Date() },
      { new: true }
    ).select('-password');
    
    res.json({ 
      success: true, 
      profilePicture: result.secure_url,
      user: user
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete profile picture
router.delete('/delete-profile-pic', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.profilePicture) {
      const parts = user.profilePicture.split('/');
      const filename = parts[parts.length - 1];
      const publicId = `poultry-ai/profiles/${filename.split('.')[0]}`;
      
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.log('Cloudinary delete error:', cloudinaryError);
      }
    }
    
    user.profilePicture = '';
    await user.save();
    
    res.json({ success: true, message: 'Profile picture deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const farmsCount = user.farms?.length || 0;
    
    res.json({
      farms: farmsCount,
      dailyRecords: 0
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.json({ farms: 0, dailyRecords: 0 });
  }
});

// Update notification preferences
router.put('/notifications', auth, async (req, res) => {
  try {
    const { emailAlerts, smsAlerts, diseasePredictions } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        notificationPreferences: { 
          emailAlerts, 
          smsAlerts, 
          diseasePredictions 
        },
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');
    
    res.json(user.notificationPreferences || { emailAlerts, smsAlerts, diseasePredictions });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;