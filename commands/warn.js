const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warn = require('../models/Warn');
const { getSettings } = require('../utils/settings');
module.exports = {
  data: new SlashCommandBuilder().setName('warn').setDescription('Warn a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(i) {
    const user = i.options.getUser('user');
    const reason = i.options.getString('reason');
    const doc = await Warn.findOneAndUpdate(
      { userId: user.id, guildId: i.guildId },
      { $inc: { warns: 1 }, $push: { history: { reason, moderatorId: i.user.id, severity: 'medium' } } },
      { upsert: true, new: true }
    );
    const s = await getSettings(i.guildId);
    let extra = '';
    const member = await i.guild.members.fetch(user.id).catch(() => null);
    if (member) {
      if (doc.warns >= s.punishments.warnsToBan) { await member.ban({ reason: `Auto-ban after ${doc.warns} warns` }).catch(() => {}); extra = ' → auto-banned'; }
      else if (doc.warns >= s.punishments.warnsToMute) { await member.timeout(s.punishments.muteMinutes*60_000, `Auto-mute after ${doc.warns} warns`).catch(() => {}); extra = ` → muted ${s.punishments.muteMinutes}m`; }
    }
    await i.reply({ content: `⚠️ Warned ${user} (total: ${doc.warns})${extra}\nReason: ${reason}`, ephemeral: false });
  }
};
