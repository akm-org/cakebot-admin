const GuildSettings = require('../models/GuildSettings');
const cache = new Map();
async function getSettings(guildId) {
  if (cache.has(guildId)) return cache.get(guildId);
  let s = await GuildSettings.findOne({ guildId });
  if (!s) s = await GuildSettings.create({ guildId });
  cache.set(guildId, s);
  setTimeout(() => cache.delete(guildId), 60_000);
  return s;
}
function invalidate(guildId) { cache.delete(guildId); }
module.exports = { getSettings, invalidate };
