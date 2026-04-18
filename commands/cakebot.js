const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
  data: new SlashCommandBuilder().setName('cakebot').setDescription('Open the CakeBot control panel'),
  async execute(i) {
    const e = new EmbedBuilder()
      .setTitle('🍰 CakeBot')
      .setDescription('Production moderation, tickets, leveling, anti-raid, and AI moderation powered by Gemini.')
      .addFields(
        { name: 'Modules', value: 'AI Mod • AutoMod • Tickets • Levels • Anti-Raid • Logging' },
        { name: 'Configure', value: 'Use the dashboard or `/setup`' },
      ).setColor(0xff7eb6);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('panel_help').setLabel('Help').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setURL('https://discord.gg/').setLabel('Support').setStyle(ButtonStyle.Link),
    );
    await i.reply({ embeds: [e], components: [row], ephemeral: true });
  }
};
