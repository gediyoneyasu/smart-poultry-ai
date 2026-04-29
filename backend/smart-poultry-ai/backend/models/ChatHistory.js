const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema({
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    content: String,
    language: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
