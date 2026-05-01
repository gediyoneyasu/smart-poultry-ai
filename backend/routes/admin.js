const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Company = require('../models/Company');
const Contact = require('../models/Contact');
const { auth } = require('../middleware/auth');

// Admin middleware
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply admin middleware
router.use(auth, isAdmin);

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalCompanyAdmins = await User.countDocuments({ role: 'company_admin' });
    const totalEmployees = await User.countDocuments({ role: { $in: ['farm_manager', 'farm_worker'] } });
    const totalCompanies = await Company.countDocuments();
    
    let totalFarms = 0;
    let totalRecords = 0;
    const users = await User.find();
    users.forEach(user => {
      totalFarms += user.farms?.length || 0;
      totalRecords += user.dailyRecords?.length || 0;
    });
    
    res.json({
      totalUsers,
      totalFarms,
      totalRecords,
      totalCompanies,
      totalFarmers,
      totalEmployees
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all farms (from all users)
router.get('/all-farms', async (req, res) => {
  try {
    const users = await User.find().select('name email farms');
    const allFarms = [];
    
    users.forEach(user => {
      if (user.farms && user.farms.length > 0) {
        user.farms.forEach(farm => {
          allFarms.push({
            ...farm.toObject(),
            ownerName: user.name,
            ownerEmail: user.email
          });
        });
      }
    });
    
    res.json(allFarms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all daily records (from all users)
router.get('/all-records', async (req, res) => {
  try {
    const users = await User.find().select('name email farms dailyRecords');
    const allRecords = [];
    
    users.forEach(user => {
      if (user.dailyRecords && user.dailyRecords.length > 0) {
        user.dailyRecords.forEach(record => {
          const farm = user.farms?.find(f => f._id.toString() === record.farmId?.toString());
          allRecords.push({
            ...record.toObject(),
            userName: user.name,
            userEmail: user.email,
            farmName: farm?.name || 'Unknown'
          });
        });
      }
    });
    
    allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(allRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find().populate('ownerId', 'name email');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all contacts
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.put('/users/:userId/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:userId', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact status
router.put('/contacts/:contactId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      { status },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
