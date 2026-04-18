const mongoose = require('mongoose');
module.exports = mongoose.model('Ticket', new mongoose.Schema({
  guildId: { type: String, index: true },
  channelId: { type: String, index: true },
  userId: String,
  status: { type: String, enum: ['open','closed'], default: 'open' },
  openedAt: { type: Date, default: Date.now },
  closedAt: Date,
  transcript: String,
}));
