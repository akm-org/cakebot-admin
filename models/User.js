const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
  userId: { type: String, index: true },
  guildId: { type: String, index: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  lastMessage: { type: Date, default: () => new Date(0) },
}));
