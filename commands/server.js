const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ping } = require('bedrock-protocol');
module.exports = {
  data: new SlashCommandBuilder().setName('server').setDescription('Show Bedrock server status')
    .addStringOption(o => o.setName('host').setDescription('host:port (optional)')),
  async execute(i) {
    await i.deferReply();
    const raw = i.options.getString('host') || `${process.env.BEDROCK_HOST || ''}:${process.env.BEDROCK_PORT || 19132}`;
    const [host, portStr] = raw.split(':');
    const port = parseInt(portStr) || 19132;
    if (!host) return i.editReply('No Bedrock host configured. Set BEDROCK_HOST or pass host.');
    try {
      const r = await ping({ host, port });
      const e = new EmbedBuilder().setTitle(`🟢 ${r.motd || host}`).setColor(0x22c55e).addFields(
        { name: 'Players', value: `${r.playersOnline}/${r.playersMax}`, inline: true },
        { name: 'Version', value: `${r.version} (proto ${r.protocol})`, inline: true },
        { name: 'Gamemode', value: String(r.gamemode || 'n/a'), inline: true },
        { name: 'Address', value: `${host}:${port}` },
      );
      await i.editReply({ embeds: [e] });
    } catch (e) {
      await i.editReply({ embeds: [new EmbedBuilder().setTitle(`🔴 Offline`).setDescription(`${host}:${port}\n\`${e.message}\``).setColor(0xef4444)] });
    }
  }
};
