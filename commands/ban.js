const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('ban').setDescription('Ban a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(i) {
    const u = i.options.getUser('user'); const r = i.options.getString('reason') || 'No reason';
    await i.guild.members.ban(u.id, { reason: r }).catch(e => i.reply({ content: 'Ban failed: ' + e.message, ephemeral: true }));
    await i.reply(`🔨 Banned ${u} — ${r}`);
  }
};
