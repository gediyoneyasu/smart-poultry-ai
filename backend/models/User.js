const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Daily Record Schema
const DailyRecordSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  totalBirds: { type: Number, default: 0 },
  healthyBirds: { type: Number, default: 0 },
  sickBirds: { type: Number, default: 0 },
  deadBirds: { type: Number, default: 0 },
  eggsCollected: { type: Number, default: 0 },
  eggsSold: { type: Number, default: 0 },
  eggPrice: { type: Number, default: 5 },
  feedConsumed: { type: Number, default: 0 },
  feedCost: { type: Number, default: 0 },
  medicineCost: { type: Number, default: 0 },
  otherExpenses: { type: Number, default: 0 },
  temperature: { type: Number, default: 0 },
  humidity: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now }
});

// Farm Schema
const FarmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: '' },
  totalBirds: { type: Number, default: 0 },
  birdType: { type: String, enum: ['Layers', 'Broilers', 'Dual Purpose'], default: 'Layers' },
  establishedDate: Date,
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Company Schema
const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  managerIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  farms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  }],
  address: String,
  phone: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { 
    type: String, 
    enum: ['farmer', 'company_admin', 'farm_manager', 'employee', 'admin', 'vet'],
    default: 'farmer'
  },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  address: { type: String, default: '' },
  
  // For individual farmers
  farms: [FarmSchema],
  dailyRecords: [DailyRecordSchema],
  
  // For company employees
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  assignedFarmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
  },
  
  // Company ownership
  ownedCompanies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }],
  
  preferences: {
    language: { type: String, default: 'en' },
    notifications: {
      emailAlerts: { type: Boolean, default: true },
      smsAlerts: { type: Boolean, default: false },
      pushNotifications: { type: Boolean, default: true }
    },
    theme: { type: String, default: 'dark' }
  },
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: Date
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.updatedAt = new Date();
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ companyId: 1 });

module.exports = mongoose.model('User', UserSchema);
