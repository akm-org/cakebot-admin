const { getSettings } = require('../utils/settings');
const { log } = require('../utils/logger');
module.exports = { name: 'guildMemberRemove', async execute(member) {
  const s = await getSettings(member.guild.id);
  if (s.modules.logging) await log(member.guild, 'member_leave', { userId: member.id }, s.channels.joinLog || s.channels.log);
}};
