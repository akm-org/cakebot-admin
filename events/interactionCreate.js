const tickets = require('../systems/tickets');
module.exports = { name: 'interactionCreate', async execute(interaction, client) {
  try {
    if (interaction.isButton()) {
      const handled = await tickets.handle(interaction);
      if (handled) return;
    }
    if (!interaction.isChatInputCommand()) return;
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    await cmd.execute(interaction);
  } catch (e) {
    console.error('[interaction] error', e);
    if (interaction.deferred || interaction.replied) interaction.followUp({ content: 'Error: ' + e.message, ephemeral: true }).catch(() => {});
    else interaction.reply({ content: 'Error: ' + e.message, ephemeral: true }).catch(() => {});
  }
}};
