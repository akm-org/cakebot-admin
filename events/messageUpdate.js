const { getSettings } = require('../utils/settings');
const { log } = require('../utils/logger');
module.exports = { name: 'messageUpdate', async execute(oldM, newM) {
  if (!newM.guild || newM.author?.bot) return;
  if (oldM.content === newM.content) return;
  const s = await getSettings(newM.guildId);
  if (!s.modules.logging) return;
  await log(newM.guild, 'message_edit', { userId: newM.author?.id, channelId: newM.channelId, before: (oldM.content||'').slice(0,800), after: (newM.content||'').slice(0,800) }, s.channels.log);
}};
