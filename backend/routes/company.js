const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Company = require('../models/Company');
const { auth } = require('../middleware/auth');
const mongoose = require('mongoose');

// ============ HELPER FUNCTION ============
const ensureCompanyAdminRole = async (userId) => {
  const user = await User.findById(userId);
  if (user && user.role !== 'company_admin') {
    user.role = 'company_admin';
    await user.save();
    console.log(`✅ Updated user ${user.name} to company_admin role`);
  }
  return user;
};

// ============ COMPANY MANAGEMENT ============

// Get or auto-create company for ANY user
router.get('/my-company', auth, async (req, res) => {
  try {
    let company = await Company.findOne({ ownerId: req.user.id });
    
    if (!company) {
      // Auto-create company for ANY user who requests it
      const user = await User.findById(req.user.id);
      
      company = new Company({
        name: `${user.name}'s Company`,
        ownerId: req.user.id,
        createdAt: new Date()
      });
      await company.save();
      
      // Update user role to company_admin
      user.role = 'company_admin';
      user.ownedCompanyId = company._id;
      await user.save();
      
      console.log(`✅ Auto-created company for user: ${user.name} (role updated to company_admin)`);
    }
    
    res.json({ success: true, company });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create or Update company (any user can do this)
router.put('/my-company', auth, async (req, res) => {
  try {
    const { name, description, address, phone, email } = req.body;
    
    // Ensure user becomes company_admin
    await ensureCompanyAdminRole(req.user.id);
    
    let company = await Company.findOne({ ownerId: req.user.id });
    
    if (company) {
      // Update existing company
      company = await Company.findOneAndUpdate(
        { ownerId: req.user.id },
        { 
          name: name || company.name,
          description: description || '',
          address: address || '',
          phone: phone || '',
          email: email || '',
          updatedAt: new Date() 
        },
        { new: true }
      );
    } else {
      // Create new company
      const user = await User.findById(req.user.id);
      company = new Company({
        name: name || `${user.name}'s Company`,
        description: description || '',
        address: address || '',
        phone: phone || '',
        email: email || '',
        ownerId: req.user.id,
        createdAt: new Date()
      });
      await company.save();
      
      user.ownedCompanyId = company._id;
      user.role = 'company_admin';
      await user.save();
    }
    
    res.json({ success: true, company });
  } catch (error) {
    console.error('Company operation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ FARM MANAGEMENT ============

router.get('/farms', auth, async (req, res) => {
  try {
    const company = await Company.findOne({ ownerId: req.user.id });
    if (!company) {
      return res.json({ success: true, farms: [] });
    }
    
    const user = await User.findById(req.user.id);
    const companyFarms = user.farms.filter(f => f.companyId && f.companyId.toString() === company._id.toString());
    
    res.json({ success: true, farms: companyFarms });
  } catch (error) {
    console.error('Get company farms error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/farms', auth, async (req, res) => {
  try {
    const { name, location, totalBirds, birdType, establishedDate, phone, email } = req.body;
    
    let company = await Company.findOne({ ownerId: req.user.id });
    
    // Auto-create company if doesn't exist
    if (!company) {
      const user = await User.findById(req.user.id);
      company = new Company({
        name: `${user.name}'s Company`,
        ownerId: req.user.id,
        createdAt: new Date()
      });
      await company.save();
      
      user.ownedCompanyId = company._id;
      user.role = 'company_admin';
      await user.save();
      console.log(`✅ Auto-created company for farm creation`);
    }
    
    const user = await User.findById(req.user.id);
    
    const newFarm = {
      _id: new mongoose.Types.ObjectId(),
      name,
      location: location || '',
      totalBirds: totalBirds || 0,
      birdType: birdType || 'Layers',
      establishedDate: establishedDate ? new Date(establishedDate) : null,
      phone: phone || '',
      email: email || '',
      companyId: company._id,
      ownerType: 'company',
      ownerId: req.user.id,
      createdAt: new Date()
    };
    
    user.farms.push(newFarm);
    await user.save();
    
    company.farms.push(newFarm._id);
    await company.save();
    
    res.status(201).json({ success: true, farm: newFarm });
  } catch (error) {
    console.error('Create company farm error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/farms/:farmId', auth, async (req, res) => {
  try {
    const company = await Company.findOne({ ownerId: req.user.id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    const user = await User.findById(req.user.id);
    user.farms = user.farms.filter(f => f._id.toString() !== req.params.farmId);
    await user.save();
    
    company.farms = company.farms.filter(f => f.toString() !== req.params.farmId);
    await company.save();
    
    res.json({ success: true, message: 'Farm deleted' });
  } catch (error) {
    console.error('Delete company farm error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ EMPLOYEE MANAGEMENT ============

router.get('/employees', auth, async (req, res) => {
  try {
    const company = await Company.findOne({ ownerId: req.user.id });
    if (!company) {
      return res.json({ success: true, employees: [] });
    }
    
    const employees = await User.find({ 
      companyId: company._id,
      role: { $in: ['farm_manager', 'farm_worker'] }
    }).select('-password');
    
    res.json({ success: true, employees });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/employees', auth, async (req, res) => {
  try {
    const { name, email, username, password, role } = req.body;
    
    let company = await Company.findOne({ ownerId: req.user.id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found. Create company first.' });
    }
    
    let employee = await User.findOne({ email });
    
    if (employee) {
      if (employee.companyId) {
        return res.status(400).json({ message: 'User already belongs to a company' });
      }
      employee.companyId = company._id;
      employee.role = role;
      employee.username = username || email.split('@')[0];
      await employee.save();
    } else {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      employee = new User({
        name,
        email,
        username: username || email.split('@')[0],
        password: hashedPassword,
        role: role,
        companyId: company._id,
        isActive: true
      });
      await employee.save();
    }
    
    company.employees.push(employee._id);
    await company.save();
    
    res.status(201).json({ 
      success: true, 
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        username: employee.username,
        role: employee.role
      }
    });
  } catch (error) {
    console.error('Add employee error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/employees/:employeeId', auth, async (req, res) => {
  try {
    const company = await Company.findOne({ ownerId: req.user.id });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    const employee = await User.findById(req.params.employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    employee.companyId = null;
    employee.role = 'farmer';
    await employee.save();
    
    company.employees = company.employees.filter(e => e.toString() !== req.params.employeeId);
    await company.save();
    
    res.json({ success: true, message: 'Employee removed' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ EMPLOYEE LOGIN ============

router.post('/employee-login', async (req, res) => {
  try {
    const { companyName, username, password } = req.body;
    
    if (!companyName || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const company = await Company.findOne({ name: companyName });
    if (!company) {
      return res.status(401).json({ message: 'Invalid company name' });
    }
    
    const employee = await User.findOne({ 
      username: username,
      companyId: company._id,
      role: { $in: ['farm_manager', 'farm_worker'] }
    });
    
    if (!employee) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    res.json({
      success: true,
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        username: username,
        role: employee.role,
        companyId: company._id,
        companyName: company.name
      }
    });
  } catch (error) {
    console.error('Employee login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ EMPLOYEE RECORDS ============

router.get('/employee/farms', async (req, res) => {
  try {
    const employeeId = req.headers['x-employee-id'];
    if (!employeeId) {
      return res.status(401).json({ message: 'Employee ID required' });
    }
    
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Find company owner to get farms
    const company = await Company.findById(employee.companyId);
    if (!company) {
      return res.json({ success: true, farms: [] });
    }
    
    const companyOwner = await User.findById(company.ownerId);
    const companyFarms = companyOwner?.farms.filter(f => f.companyId?.toString() === company._id.toString()) || [];
    
    res.json({ success: true, farms: companyFarms });
  } catch (error) {
    console.error('Get employee farms error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/employee/records/:farmId', async (req, res) => {
  try {
    const employeeId = req.headers['x-employee-id'];
    if (!employeeId) {
      return res.status(401).json({ message: 'Employee ID required' });
    }
    
    const { farmId } = req.params;
    
    const farmOwner = await User.findOne({ 'farms._id': farmId });
    if (!farmOwner) {
      return res.json({ success: true, records: [] });
    }
    
    const records = farmOwner.dailyRecords.filter(r => 
      r.farmId?.toString() === farmId && 
      r.recordedBy?.toString() === employeeId
    );
    
    res.json({ success: true, records: records.sort((a, b) => new Date(b.date) - new Date(a.date)) });
  } catch (error) {
    console.error('Get employee records error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/employee/records', async (req, res) => {
  try {
    const employeeId = req.headers['x-employee-id'];
    if (!employeeId) {
      return res.status(401).json({ message: 'Employee ID required' });
    }
    
    const { farmId, date, totalBirds, healthyBirds, sickBirds, deadBirds, 
            eggsCollected, eggsSold, eggPrice, feedConsumed, feedCost, medicineCost, 
            otherExpenses, temperature, humidity, notes } = req.body;
    
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const farmOwner = await User.findOne({ 'farms._id': farmId });
    if (!farmOwner) {
      return res.status(404).json({ message: 'Farm not found' });
    }
    
    const newRecord = {
      _id: new mongoose.Types.ObjectId(),
      farmId: farmId,
      date: date ? new Date(date) : new Date(),
      totalBirds: parseInt(totalBirds) || 0,
      healthyBirds: parseInt(healthyBirds) || 0,
      sickBirds: parseInt(sickBirds) || 0,
      deadBirds: parseInt(deadBirds) || 0,
      eggsCollected: parseInt(eggsCollected) || 0,
      eggsSold: parseInt(eggsSold) || 0,
      eggPrice: parseFloat(eggPrice) || 5,
      feedConsumed: parseInt(feedConsumed) || 0,
      feedCost: parseInt(feedCost) || 0,
      medicineCost: parseInt(medicineCost) || 0,
      otherExpenses: parseInt(otherExpenses) || 0,
      temperature: parseFloat(temperature) || 0,
      humidity: parseInt(humidity) || 0,
      notes: notes || '',
      recordedBy: employeeId,
      approved: false,
      createdAt: new Date()
    };
    
    farmOwner.dailyRecords.push(newRecord);
    await farmOwner.save();
    
    res.status(201).json({ success: true, record: newRecord });
  } catch (error) {
    console.error('Employee add record error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ STATISTICS ============

router.get('/stats', auth, async (req, res) => {
  try {
    const company = await Company.findOne({ ownerId: req.user.id });
    if (!company) {
      return res.json({ totalFarms: 0, totalEmployees: 0, totalBirds: 0, totalProfit: 0 });
    }
    
    const user = await User.findById(req.user.id);
    const companyFarms = user.farms.filter(f => f.companyId && f.companyId.toString() === company._id.toString());
    
    const totalFarms = companyFarms.length;
    const totalEmployees = company.employees.length;
    const totalBirds = companyFarms.reduce((sum, farm) => sum + (farm.totalBirds || 0), 0);
    
    let totalProfit = 0;
    for (const farm of companyFarms) {
      const farmRecords = user.dailyRecords.filter(r => r.farmId && r.farmId.toString() === farm._id.toString());
      const farmIncome = farmRecords.reduce((sum, r) => sum + (r.eggsSold || 0) * (r.eggPrice || 5), 0);
      const farmExpenses = farmRecords.reduce((sum, r) => sum + (r.feedCost || 0) + (r.medicineCost || 0) + (r.otherExpenses || 0), 0);
      totalProfit += (farmIncome - farmExpenses);
    }
    
    res.json({ totalFarms, totalEmployees, totalBirds, totalProfit });
  } catch (error) {
    console.error('Company stats error:', error);
    res.json({ totalFarms: 0, totalEmployees: 0, totalBirds: 0, totalProfit: 0 });
  }
});

module.exports = router;