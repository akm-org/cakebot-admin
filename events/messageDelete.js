const { getSettings } = require('../utils/settings');
const { log } = require('../utils/logger');
module.exports = { name: 'messageDelete', async execute(message) {
  if (!message.guild || message.author?.bot) return;
  const s = await getSettings(message.guildId);
  if (!s.modules.logging) return;
  await log(message.guild, 'message_delete', { userId: message.author?.id, channelId: message.channelId, content: (message.content || '').slice(0, 1500) }, s.channels.log);
}};
