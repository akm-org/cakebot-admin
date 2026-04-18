const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getSettings, invalidate } = require('../utils/settings');
module.exports = {
  data: new SlashCommandBuilder().setName('setup').setDescription('Configure CakeBot for this server')
    .addChannelOption(o => o.setName('logchannel').setDescription('Log channel').addChannelTypes(ChannelType.GuildText))
    .addChannelOption(o => o.setName('ticketcategory').setDescription('Ticket category').addChannelTypes(ChannelType.GuildCategory))
    .addRoleOption(o => o.setName('autorole').setDescription('Auto role on join'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(i) {
    const s = await getSettings(i.guildId);
    const log = i.options.getChannel('logchannel');
    const cat = i.options.getChannel('ticketcategory');
    const role = i.options.getRole('autorole');
    if (log) s.channels.log = log.id;
    if (cat) s.channels.ticketCategory = cat.id;
    if (role) s.autoRoleId = role.id;
    await s.save(); invalidate(i.guildId);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_create').setLabel('🎫 Create Ticket').setStyle(ButtonStyle.Primary)
    );
    await i.reply({ content: '✅ Settings saved. Ticket panel:', components: [row] });
  }
};
