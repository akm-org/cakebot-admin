const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('kick').setDescription('Kick a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(i) {
    const u = i.options.getUser('user'); const r = i.options.getString('reason') || 'No reason';
    const m = await i.guild.members.fetch(u.id).catch(() => null);
    if (!m) return i.reply({ content: 'Not in server', ephemeral: true });
    await m.kick(r);
    await i.reply(`👢 Kicked ${u} — ${r}`);
  }
};
