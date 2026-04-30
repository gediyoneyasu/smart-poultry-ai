const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Company = require('../models/Company');
const { auth } = require('../middleware/auth');

// Create a company
router.post('/create', auth, async (req, res) => {
  try {
    const { name, address, phone, email } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Check if user can create a company (only farmers or company_admins)
    if (user.role !== 'farmer' && user.role !== 'company_admin') {
      return res.status(403).json({ message: 'Not authorized to create a company' });
    }
    
    const company = new Company({
      name,
      ownerId: req.user.id,
      address,
      phone,
      email,
      managerIds: [req.user.id],
      createdAt: new Date()
    });
    
    await company.save();
    
    // Update user role to company_admin
    user.role = 'company_admin';
    user.ownedCompanies.push(company._id);
    await user.save();
    
    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user's company
router.get('/my-company', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const company = await Company.findOne({ ownerId: req.user.id })
      .populate('farms')
      .populate('managerIds', 'name email');
    
    if (!company) {
      // Check if user is a manager in a company
      const companyAsManager = await Company.findOne({ managerIds: req.user.id })
        .populate('farms')
        .populate('ownerId', 'name email');
      return res.json(companyAsManager || null);
    }
    
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add farm to company
router.post('/add-farm', auth, async (req, res) => {
  try {
    const { name, location, totalBirds, birdType } = req.body;
    
    const company = await Company.findOne({ ownerId: req.user.id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    const newFarm = {
      name,
      location,
      totalBirds: totalBirds || 0,
      birdType: birdType || 'Layers',
      companyId: company._id,
      managerId: req.user.id,
      createdAt: new Date()
    };
    
    const user = await User.findById(req.user.id);
    user.farms.push(newFarm);
    await user.save();
    
    const savedFarm = user.farms[user.farms.length - 1];
    company.farms.push(savedFarm._id);
    await company.save();
    
    res.status(201).json(savedFarm);
  } catch (error) {
    console.error('Error adding farm:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add employee to farm
router.post('/add-employee', auth, async (req, res) => {
  try {
    const { email, farmId, role } = req.body;
    
    const company = await Company.findOne({ ownerId: req.user.id });
    if (!company) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const employee = await User.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update employee role
    employee.role = role || 'employee';
    employee.companyId = company._id;
    employee.assignedFarmId = farmId;
    await employee.save();
    
    // Add to farm employees
    const owner = await User.findById(req.user.id);
    const farm = owner.farms.find(f => f._id.toString() === farmId);
    if (farm) {
      farm.employees.push(employee._id);
      await owner.save();
    }
    
    res.json({ message: 'Employee added successfully', employee });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get farm employees
router.get('/farm/:farmId/employees', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const farm = user.farms.find(f => f._id.toString() === req.params.farmId);
    
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }
    
    const employees = await User.find({ 
      assignedFarmId: req.params.farmId,
      role: 'employee'
    }).select('name email phone');
    
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
