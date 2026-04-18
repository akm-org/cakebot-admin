const { getSettings } = require('../utils/settings');
const { log } = require('../utils/logger');
const antiraid = require('../systems/antiraid');
module.exports = { name: 'guildMemberAdd', async execute(member) {
  try {
    const s = await getSettings(member.guild.id);
    if (s.autoRoleId) await member.roles.add(s.autoRoleId).catch(() => {});
    await antiraid.onJoin(member);
    if (s.modules.logging) await log(member.guild, 'member_join', { userId: member.id }, s.channels.joinLog || s.channels.log);
  } catch (e) { console.error('[guildMemberAdd]', e); }
}};
