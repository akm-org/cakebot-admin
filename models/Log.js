const mongoose = require('mongoose');
module.exports = mongoose.model('Log', new mongoose.Schema({
  guildId: { type: String, index: true },
  type: String,
  userId: String,
  moderatorId: String,
  data: mongoose.Schema.Types.Mixed,
  at: { type: Date, default: Date.now },
}));
