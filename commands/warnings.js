const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Warn = require('../models/Warn');
module.exports = {
  data: new SlashCommandBuilder().setName('warnings').setDescription('View warnings for a user')
    .addUserOption(o => o.setName('user').setDescription('User').setRequired(true)),
  async execute(i) {
    const user = i.options.getUser('user');
    const doc = await Warn.findOne({ userId: user.id, guildId: i.guildId });
    if (!doc || !doc.warns) return i.reply({ content: `${user} has no warnings.`, ephemeral: true });
    const e = new EmbedBuilder().setTitle(`Warnings for ${user.tag}`).setDescription(
      doc.history.slice(-10).map((h, idx) => `**${idx+1}.** [${h.severity}] ${h.reason} — <@${h.moderatorId}> · <t:${Math.floor(new Date(h.at).getTime()/1000)}:R>`).join('\n')
    ).setFooter({ text: `Total: ${doc.warns}` });
    await i.reply({ embeds: [e], ephemeral: true });
  }
};
