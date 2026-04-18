const Log = require('../models/Log');
const { EmbedBuilder } = require('discord.js');
async function log(guild, type, payload, channelId) {
  try {
    await Log.create({ guildId: guild.id, type, userId: payload.userId, moderatorId: payload.moderatorId, data: payload });
    if (channelId) {
      const ch = await guild.channels.fetch(channelId).catch(() => null);
      if (ch?.isTextBased()) {
        const e = new EmbedBuilder().setTitle(`Log: ${type}`).setDescription('```json\n' + JSON.stringify(payload, null, 2).slice(0, 1800) + '\n```').setTimestamp();
        await ch.send({ embeds: [e] }).catch(() => {});
      }
    }
  } catch (e) { console.error('[log] fail', e.message); }
}
module.exports = { log };
