const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  house: {
    type: String,
    enum: ['A', 'B', 'C', 'D'],
    required: true
  },
  temperature: Number,
  humidity: Number,
  feedIntake: Number,
  waterConsumption: Number,
  eggCount: Number,
  mortalityCount: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

SensorDataSchema.index({ farmId: 1, timestamp: -1 });

module.exports = mongoose.model('SensorData', SensorDataSchema);
