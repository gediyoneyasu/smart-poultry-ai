const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { cloudinary, upload, uploadToCloudinary } = require('../config/cloudinary');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

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

// Upload profile picture to Cloudinary (working version)
router.post('/upload-profile-pic', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'poultry-ai/profiles');
    
    // Update user with new profile picture URL
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

// Delete profile picture from Cloudinary
router.delete('/delete-profile-pic', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.profilePicture) {
      // Extract public ID from Cloudinary URL
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

module.exports = router;
