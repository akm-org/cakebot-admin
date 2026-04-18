const automod = require('../systems/automod');
const aimod = require('../systems/aimod');
const levels = require('../systems/levels');
module.exports = { name: 'messageCreate', async execute(message) {
  try {
    if (message.author.bot || !message.guild) return;
    await automod.check(message);
    if (!message.deletable) {} // continue regardless
    await levels.onMessage(message);
    await aimod.check(message);
  } catch (e) { console.error('[messageCreate]', e); }
}};
