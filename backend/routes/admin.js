const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Company = require('../models/Company');
const { auth, isAdmin } = require('../middleware/auth');

// Apply admin middleware to all routes
router.use(auth, isAdmin);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all farms (from ALL users)
router.get('/all-farms', async (req, res) => {
  try {
    const users = await User.find().select('farms name email role');
    const allFarms = [];
    
    users.forEach(user => {
      if (user.farms && user.farms.length > 0) {
        user.farms.forEach(farm => {
          allFarms.push({
            ...farm.toObject(),
            ownerName: user.name,
            ownerEmail: user.email,
            ownerRole: user.role,
            ownerId: user._id
          });
        });
      }
    });
    
    res.json(allFarms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all daily records (from ALL users)
router.get('/all-records', async (req, res) => {
  try {
    const users = await User.find().select('dailyRecords name email farms');
    const allRecords = [];
    
    users.forEach(user => {
      if (user.dailyRecords && user.dailyRecords.length > 0) {
        user.dailyRecords.forEach(record => {
          // Find farm name
          const farm = user.farms?.find(f => f._id.toString() === record.farmId?.toString());
          allRecords.push({
            ...record.toObject(),
            userName: user.name,
            userEmail: user.email,
            farmName: farm?.name || 'Unknown Farm'
          });
        });
      }
    });
    
    // Sort by date descending
    allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(allRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find()
      .populate('ownerId', 'name email')
      .populate('managerIds', 'name email')
      .populate('farms');
    res.json(companies);
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
      { role, updatedAt: new Date() },
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
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarmers = await User.countDocuments({ role: 'farmer' });
    const totalCompanyAdmins = await User.countDocuments({ role: 'company_admin' });
    const totalFarmManagers = await User.countDocuments({ role: 'farm_manager' });
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const totalCompanies = await Company.countDocuments();
    
    // Calculate total farms from all users
    const users = await User.find().select('farms');
    let totalFarms = 0;
    users.forEach(user => {
      totalFarms += (user.farms?.length || 0);
    });
    
    // Calculate total daily records
    let totalRecords = 0;
    users.forEach(user => {
      totalRecords += (user.dailyRecords?.length || 0);
    });
    
    res.json({
      totalUsers,
      totalFarmers,
      totalCompanyAdmins,
      totalFarmManagers,
      totalEmployees,
      totalCompanies,
      totalFarms,
      totalRecords
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all contact messages (existing)
router.get('/contacts', async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact status
router.put('/contacts/:contactId/status', async (req, res) => {
  try {
    const Contact = require('../models/Contact');
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
