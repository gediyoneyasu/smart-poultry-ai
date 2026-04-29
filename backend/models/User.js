const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Daily Record Schema
const DailyRecordSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm'
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
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['farmer', 'vet', 'admin'], default: 'farmer' },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  address: { type: String, default: '' },
  farms: [FarmSchema],
  dailyRecords: [DailyRecordSchema],
  notificationPreferences: {
    emailAlerts: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: false },
    diseasePredictions: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
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

module.exports = mongoose.model('User', UserSchema);
