const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
module.exports = {
  data: new SlashCommandBuilder().setName('leaderboard').setDescription('Top members by XP'),
  async execute(i) {
    const top = await User.find({ guildId: i.guildId }).sort({ level: -1, xp: -1 }).limit(10);
    const desc = top.map((u, idx) => `**${idx+1}.** <@${u.userId}> — Lv ${u.level} (${u.xp} XP)`).join('\n') || 'No data yet';
    await i.reply({ embeds: [new EmbedBuilder().setTitle('🏆 Leaderboard').setDescription(desc).setColor(0xffd166)] });
  }
};
