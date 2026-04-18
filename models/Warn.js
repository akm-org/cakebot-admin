const mongoose = require('mongoose');
const HistorySchema = new mongoose.Schema({
  reason: String,
  moderatorId: String,
  severity: { type: String, enum: ['low','medium','high'], default: 'low' },
  at: { type: Date, default: Date.now },
}, { _id: false });
module.exports = mongoose.model('Warn', new mongoose.Schema({
  userId: { type: String, index: true },
  guildId: { type: String, index: true },
  warns: { type: Number, default: 0 },
  history: [HistorySchema],
}));
