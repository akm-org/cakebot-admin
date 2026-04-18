const { getSettings } = require('../utils/settings');
const { log } = require('../utils/logger');
const joins = new Map(); // guildId -> [timestamps]
const lockdown = new Map();

async function onJoin(member) {
  const s = await getSettings(member.guild.id);
  if (!s.modules.antiRaid) return;
  const arr = (joins.get(member.guild.id) || []).filter(t => Date.now() - t < 60_000);
  arr.push(Date.now());
  joins.set(member.guild.id, arr);
  if (arr.length >= s.antiRaid.joinsPerMinute && !lockdown.get(member.guild.id)) {
    lockdown.set(member.guild.id, true);
    setTimeout(() => lockdown.delete(member.guild.id), s.antiRaid.lockdownMinutes * 60_000);
    await log(member.guild, 'antiraid_lockdown', { joinsPerMinute: arr.length }, s.channels.log);
    // disable invites by setting verification level high
    try { await member.guild.setVerificationLevel(4, 'Anti-raid lockdown'); } catch {}
    if (s.channels.log) {
      const ch = await member.guild.channels.fetch(s.channels.log).catch(() => null);
      ch?.send?.(`🚨 **Anti-raid triggered.** ${arr.length} joins in last 60s. Lockdown for ${s.antiRaid.lockdownMinutes}m.`);
    }
  }
}
module.exports = { onJoin };
