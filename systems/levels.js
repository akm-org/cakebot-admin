const User = require('../models/User');
const COOLDOWN = 60_000;
async function onMessage(message) {
  if (!message.guild || message.author.bot) return;
  const u = await User.findOne({ userId: message.author.id, guildId: message.guildId }) || new User({ userId: message.author.id, guildId: message.guildId });
  if (Date.now() - new Date(u.lastMessage).getTime() < COOLDOWN) return;
  u.xp += Math.floor(15 + Math.random() * 10);
  u.lastMessage = new Date();
  const need = 5 * Math.pow(u.level, 2) + 50 * u.level + 100;
  if (u.xp >= need) {
    u.level += 1;
    u.xp = 0;
    message.channel.send(`🎉 ${message.author} leveled up to **${u.level}**!`).catch(() => {});
  }
  await u.save();
}
module.exports = { onMessage };
