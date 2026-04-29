const User = require('../models/User');
const Farm = require('../models/Farm');
const PoultryHouse = require('../models/PoultryHouse');
const DiseaseReport = require('../models/DiseaseReport');
const Contact = require('../models/Contact');
const SensorData = require('../models/SensorData');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all farms
exports.getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.find().populate('farmerId', 'name email');
    res.json(farms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all disease reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await DiseaseReport.find()
      .populate('farmId', 'farmName')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all contact messages
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contact status
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFarms = await Farm.countDocuments();
    const totalReports = await DiseaseReport.countDocuments();
    const unreadMessages = await Contact.countDocuments({ status: 'unread' });
    const totalHouses = await PoultryHouse.countDocuments();
    
    res.json({
      totalUsers,
      totalFarms,
      totalReports,
      unreadMessages,
      totalHouses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
