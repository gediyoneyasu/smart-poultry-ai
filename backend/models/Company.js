const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
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
  logo: String,
  subscription: {
    plan: { type: String, enum: ['free', 'basic', 'premium', 'enterprise'], default: 'free' },
    expiresAt: Date,
    maxFarms: { type: Number, default: 1 },
    maxEmployees: { type: Number, default: 5 }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', CompanySchema);
