const { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const Ticket = require('../models/Ticket');
const { getSettings } = require('../utils/settings');
const { log } = require('../utils/logger');

async function handle(interaction) {
  if (!interaction.isButton()) return false;
  const s = await getSettings(interaction.guildId);

  if (interaction.customId === 'ticket_create') {
    const existing = await Ticket.findOne({ guildId: interaction.guildId, userId: interaction.user.id, status: 'open' });
    if (existing) return interaction.reply({ content: `You already have an open ticket: <#${existing.channelId}>`, ephemeral: true });

    const ch = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`.toLowerCase().slice(0, 90),
      type: ChannelType.GuildText,
      parent: s.channels.ticketCategory || null,
      permissionOverwrites: [
        { id: interaction.guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
      ],
    });
    await Ticket.create({ guildId: interaction.guildId, channelId: ch.id, userId: interaction.user.id });
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('ticket_close').setLabel('Close').setStyle(ButtonStyle.Danger));
    await ch.send({ content: `${interaction.user} Welcome — staff will be with you shortly.`, components: [row] });
    await interaction.reply({ content: `Created ${ch}`, ephemeral: true });
    return true;
  }

  if (interaction.customId === 'ticket_close') {
    const t = await Ticket.findOne({ channelId: interaction.channelId, status: 'open' });
    if (!t) return interaction.reply({ content: 'Not an open ticket.', ephemeral: true });
    await interaction.reply({ content: 'Closing in 5s — saving transcript...' });
    const msgs = await interaction.channel.messages.fetch({ limit: 100 }).catch(() => null);
    const transcript = msgs ? [...msgs.values()].reverse().map(m => `[${new Date(m.createdTimestamp).toISOString()}] ${m.author.tag}: ${m.content}`).join('\n') : '';
    t.status = 'closed'; t.closedAt = new Date(); t.transcript = transcript.slice(0, 60000); await t.save();
    if (s.channels.ticketLog || s.channels.log) {
      const lc = await interaction.guild.channels.fetch(s.channels.ticketLog || s.channels.log).catch(() => null);
      if (lc?.isTextBased()) {
        const file = new AttachmentBuilder(Buffer.from(transcript, 'utf-8'), { name: `transcript-${t.channelId}.txt` });
        await lc.send({ content: `Ticket closed by ${interaction.user} (opener <@${t.userId}>)`, files: [file] }).catch(() => {});
      }
    }
    await log(interaction.guild, 'ticket_closed', { userId: t.userId, moderatorId: interaction.user.id, channelId: t.channelId }, s.channels.log);
    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
    return true;
  }
  return false;
}
module.exports = { handle };
