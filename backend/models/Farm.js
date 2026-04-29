const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmName: {
    type: String,
    required: true
  },
  location: {
    region: String,
    zone: String,
    woreda: String,
    coordinates: { lat: Number, lng: Number }
  },
  totalBirds: {
    type: Number,
    default: 0
  },
  established: {
    type: String
  },
  totalArea: {
    type: String
  },
  phone: String,
  email: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Farm', FarmSchema);
