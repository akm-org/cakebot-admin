const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('mute').setDescription('Timeout a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Minutes').setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(i) {
    const u = i.options.getUser('user'); const m = i.options.getInteger('minutes'); const r = i.options.getString('reason') || 'No reason';
    const member = await i.guild.members.fetch(u.id).catch(() => null);
    if (!member) return i.reply({ content: 'Member not found', ephemeral: true });
    await member.timeout(m*60_000, r);
    await i.reply(`🔇 Muted ${u} for ${m}m — ${r}`);
  }
};
