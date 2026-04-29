const mongoose = require('mongoose');
const ChatHistorySchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  messages: [{ role: String, content: String, timestamp: Date }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ChatHistory', ChatHistorySchema);
