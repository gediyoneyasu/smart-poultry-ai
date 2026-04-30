const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const mongoose = require('mongoose');

// ============ FARM CRUD ============

// Get user's farms (original)
router.get('/my-farms', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.farms || []);
  } catch (error) {
    console.error('Error getting farms:', error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ ADDED: Alias for /farms (matches frontend expectation)
router.get('/farms', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ 
      success: true, 
      farms: user.farms || [], 
      count: user.farms?.length || 0 
    });
  } catch (error) {
    console.error('Error getting farms:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add new farm
router.post('/farms', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const newFarm = {
      name: req.body.name,
      location: req.body.location || '',
      totalBirds: req.body.totalBirds || 0,
      birdType: req.body.birdType || 'Layers',
      establishedDate: req.body.establishedDate ? new Date(req.body.establishedDate) : null,
      phone: req.body.phone || '',
      email: req.body.email || '',
      createdAt: new Date()
    };
    
    user.farms.push(newFarm);
    await user.save();
    
    const savedFarm = user.farms[user.farms.length - 1];
    res.status(201).json({ success: true, farm: savedFarm });
  } catch (error) {
    console.error('Error creating farm:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update farm
router.put('/farms/:farmId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const farmIndex = user.farms.findIndex(f => f._id.toString() === req.params.farmId);
    
    if (farmIndex === -1) {
      return res.status(404).json({ message: 'Farm not found' });
    }
    
    user.farms[farmIndex] = {
      ...user.farms[farmIndex].toObject(),
      name: req.body.name || user.farms[farmIndex].name,
      location: req.body.location || user.farms[farmIndex].location,
      totalBirds: req.body.totalBirds || user.farms[farmIndex].totalBirds,
      birdType: req.body.birdType || user.farms[farmIndex].birdType,
      establishedDate: req.body.establishedDate ? new Date(req.body.establishedDate) : user.farms[farmIndex].establishedDate,
      phone: req.body.phone || user.farms[farmIndex].phone,
      email: req.body.email || user.farms[farmIndex].email
    };
    
    await user.save();
    res.json({ success: true, farm: user.farms[farmIndex] });
  } catch (error) {
    console.error('Error updating farm:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete farm
router.delete('/farms/:farmId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.farms = user.farms.filter(f => f._id.toString() !== req.params.farmId);
    // Also delete associated daily records
    user.dailyRecords = user.dailyRecords.filter(r => r.farmId?.toString() !== req.params.farmId);
    await user.save();
    res.json({ success: true, message: 'Farm deleted successfully' });
  } catch (error) {
    console.error('Error deleting farm:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ DAILY RECORDS ============

// Get daily records for a farm
router.get('/records/:farmId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const records = user.dailyRecords.filter(r => r.farmId?.toString() === req.params.farmId);
    res.json({ 
      success: true, 
      records: records.sort((a, b) => new Date(b.date) - new Date(a.date)) 
    });
  } catch (error) {
    console.error('Error getting records:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add daily record
router.post('/records', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get farm to verify it exists
    const farm = user.farms.find(f => f._id.toString() === req.body.farmId);
    if (!farm && req.body.farmId) {
      return res.status(404).json({ message: 'Farm not found' });
    }
    
    const newRecord = {
      farmId: req.body.farmId ? new mongoose.Types.ObjectId(req.body.farmId) : null,
      date: req.body.date ? new Date(req.body.date) : new Date(),
      totalBirds: parseInt(req.body.totalBirds) || 0,
      healthyBirds: parseInt(req.body.healthyBirds) || 0,
      sickBirds: parseInt(req.body.sickBirds) || 0,
      deadBirds: parseInt(req.body.deadBirds) || 0,
      eggsCollected: parseInt(req.body.eggsCollected) || 0,
      eggsSold: parseInt(req.body.eggsSold) || 0,
      eggPrice: parseFloat(req.body.eggPrice) || 5,
      feedConsumed: parseInt(req.body.feedConsumed) || 0,
      feedCost: parseInt(req.body.feedCost) || 0,
      medicineCost: parseInt(req.body.medicineCost) || 0,
      otherExpenses: parseInt(req.body.otherExpenses) || 0,
      temperature: parseFloat(req.body.temperature) || 0,
      humidity: parseInt(req.body.humidity) || 0,
      notes: req.body.notes || '',
      createdAt: new Date()
    };
    
    user.dailyRecords.push(newRecord);
    await user.save();
    
    const savedRecord = user.dailyRecords[user.dailyRecords.length - 1];
    console.log('Record saved successfully:', savedRecord._id);
    res.status(201).json({ success: true, record: savedRecord });
  } catch (error) {
    console.error('Error saving record:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ AI SUGGESTIONS ============

// Get AI suggestions based on farm data
router.get('/suggestions/:farmId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const farm = user.farms.find(f => f._id.toString() === req.params.farmId);
    const farmRecords = user.dailyRecords.filter(r => r.farmId?.toString() === req.params.farmId);
    
    if (!farm || farmRecords.length === 0) {
      return res.json({
        summary: "📊 Add daily records to get personalized AI suggestions!",
        suggestions: []
      });
    }
    
    const last7Days = farmRecords.slice(0, 7);
    const avgEggProduction = last7Days.reduce((sum, r) => sum + (r.eggsCollected || 0), 0) / Math.min(7, last7Days.length);
    const avgMortality = last7Days.reduce((sum, r) => sum + (r.deadBirds || 0), 0) / Math.min(7, last7Days.length);
    const avgHealthy = last7Days.reduce((sum, r) => sum + (r.healthyBirds || 0), 0) / Math.min(7, last7Days.length);
    const totalIncome = farmRecords.reduce((sum, r) => sum + (r.eggsSold || 0) * (r.eggPrice || 5), 0);
    const totalExpenses = farmRecords.reduce((sum, r) => sum + (r.feedCost || 0) + (r.medicineCost || 0) + (r.otherExpenses || 0), 0);
    const profit = totalIncome - totalExpenses;
    
    const suggestions = [];
    
    // Egg Production Analysis
    const expectedEggs = farm.totalBirds * 0.8;
    if (avgEggProduction < expectedEggs * 0.7) {
      suggestions.push({
        type: 'production',
        priority: 'high',
        icon: '🥚',
        title: 'Critical: Low Egg Production',
        message: `Your farm produces ${avgEggProduction.toFixed(0)} eggs/day. Expected: ${expectedEggs.toFixed(0)} eggs/day.`,
        actions: [
          'Increase feed protein to 18%',
          'Ensure 16 hours of light daily',
          'Add calcium supplement',
          'Check water quality'
        ]
      });
    }
    
    // Health Analysis
    if (farm.totalBirds > 0) {
      const healthPercentage = (avgHealthy / farm.totalBirds) * 100;
      if (healthPercentage < 85) {
        suggestions.push({
          type: 'health',
          priority: 'critical',
          icon: '⚠️',
          title: 'URGENT: Flock Health Issue',
          message: `Only ${healthPercentage.toFixed(0)}% of your flock is healthy.`,
          actions: [
            'Contact veterinarian immediately',
            'Check for disease symptoms',
            'Improve ventilation',
            'Disinfect the house'
          ]
        });
      }
    }
    
    // Financial Analysis
    if (profit < 0) {
      suggestions.push({
        type: 'financial',
        priority: 'high',
        icon: '💰',
        title: 'Financial Alert: Operating at Loss',
        message: `Total loss: ETB ${Math.abs(profit).toFixed(0)}.`,
        actions: [
          'Increase egg price by ETB 1.00',
          'Sell directly to consumers',
          'Buy feed in bulk',
          'Track all expenses daily'
        ]
      });
    }
    
    // Environment Analysis
    const latestRecord = farmRecords[0];
    if (latestRecord && latestRecord.temperature > 33) {
      suggestions.push({
        type: 'environment',
        priority: 'high',
        icon: '🌡️',
        title: 'Heat Stress Warning',
        message: `Temperature is ${latestRecord.temperature}°C. Optimal is 18-24°C.`,
        actions: [
          'Increase ventilation',
          'Provide extra water',
          'Add fans or misters',
          'Reduce stocking density'
        ]
      });
    }
    
    const summary = `📊 AI Analysis: Found ${suggestions.length} area(s) to improve.`;
    res.json({ success: true, summary, suggestions });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ ADMIN ENDPOINTS ============

// Get all farmers data for admin
router.get('/admin/all-farmers', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    res.json({ success: true, farmers });
  } catch (error) {
    console.error('Error getting farmers:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;