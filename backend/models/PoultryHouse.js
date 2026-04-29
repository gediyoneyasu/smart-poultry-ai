const mongoose = require('mongoose');

const PoultryHouseSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  birds: {
    type: Number,
    default: 0
  },
  capacity: {
    type: Number,
    default: 500
  },
  age: {
    type: Number,
    default: 0
  },
  health: {
    type: Number,
    default: 100
  },
  vaccinated: {
    type: Boolean,
    default: false
  },
  lastCleaned: {
    type: Date,
    default: Date.now
  },
  temperature: Number,
  humidity: Number,
  feedIntake: Number,
  waterConsumption: Number,
  mortality: {
    type: Number,
    default: 0
  },
  eggProduction: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PoultryHouse', PoultryHouseSchema);
