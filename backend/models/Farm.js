const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  totalBirds: {
    type: Number,
    default: 0
  },
  birdType: {
    type: String,
    enum: ['Layers', 'Broilers', 'Dual Purpose'],
    default: 'Layers'
  },
  establishedDate: {
    type: Date,
    default: null
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  // Mode: individual or company
  ownerType: {
    type: String,
    enum: ['individual', 'company'],
    default: 'individual'
  },
  // For individual mode
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // For company mode
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
FarmSchema.index({ farmerId: 1 });
FarmSchema.index({ companyId: 1 });
FarmSchema.index({ ownerType: 1 });

module.exports = mongoose.model('Farm', FarmSchema);