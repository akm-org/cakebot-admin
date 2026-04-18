const { classify } = require('../utils/gemini');
const { getSettings } = require('../utils/settings');
const Warn = require('../models/Warn');
const { log } = require('../utils/logger');

async function check(message) {
  if (!message.guild || message.author.bot || !message.content || message.content.length < 5) return;
  const s = await getSettings(message.guildId);
  if (!s.modules.aiModeration) return;
  if (message.member?.permissions.has('ManageMessages')) return;

  const r = await classify(message.content);
  if (r.action === 'none') return;

  await log(message.guild, 'ai_mod', { userId: message.author.id, content: message.content.slice(0, 500), result: r }, s.channels.log);

  if (r.action === 'warn') {
    await Warn.findOneAndUpdate({ userId: message.author.id, guildId: message.guildId },
      { $inc: { warns: 1 }, $push: { history: { reason: `AI: ${r.reason}`, moderatorId: 'ai', severity: r.severity } } },
      { upsert: true });
    await message.reply(`⚠️ ${message.author}, AI flagged this message: *${r.reason}*`).catch(() => {});
  } else if (r.action === 'mute') {
    await message.delete().catch(() => {});
    await message.member.timeout(15 * 60_000, `AI: ${r.reason}`).catch(() => {});
  } else if (r.action === 'ban') {
    await message.delete().catch(() => {});
    await message.member.ban({ reason: `AI: ${r.reason}` }).catch(() => {});
  }
}
module.exports = { check };
