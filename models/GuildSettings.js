const mongoose = require('mongoose');
module.exports = mongoose.model('GuildSettings', new mongoose.Schema({
  guildId: { type: String, unique: true, index: true },
  modules: {
    aiModeration: { type: Boolean, default: true },
    autoMod: { type: Boolean, default: true },
    tickets: { type: Boolean, default: true },
    levels: { type: Boolean, default: true },
    antiRaid: { type: Boolean, default: true },
    logging: { type: Boolean, default: true },
    fileProtect: { type: Boolean, default: true },
  },
  channels: {
    log: String,
    modLog: String,
    joinLog: String,
    ticketCategory: String,
    ticketLog: String,
  },
  autoRoleId: String,
  blacklist: [String],
  allowedDomains: [String],
  punishments: {
    warnsToMute: { type: Number, default: 3 },
    warnsToBan: { type: Number, default: 5 },
    muteMinutes: { type: Number, default: 60 },
  },
  antiRaid: {
    joinsPerMinute: { type: Number, default: 8 },
    lockdownMinutes: { type: Number, default: 10 },
  },
}, { timestamps: true }));
