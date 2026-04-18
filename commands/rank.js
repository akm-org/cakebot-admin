const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
module.exports = {
  data: new SlashCommandBuilder().setName('rank').setDescription('Show your level & XP'),
  async execute(i) {
    const u = await User.findOne({ userId: i.user.id, guildId: i.guildId }) || { xp: 0, level: 0 };
    const need = 5 * Math.pow(u.level, 2) + 50 * u.level + 100;
    await i.reply({ embeds: [new EmbedBuilder().setTitle(`${i.user.username} — Lv ${u.level}`).setDescription(`XP: **${u.xp}** / ${need}`).setColor(0x6ee7ff)], ephemeral: true });
  }
};
