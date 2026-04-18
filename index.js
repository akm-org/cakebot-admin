require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildInvites,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember],
});

client.commands = new Collection();

// Load commands
const cmdDir = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(cmdDir).filter(f => f.endsWith('.js'))) {
  const cmd = require(path.join(cmdDir, file));
  if (cmd?.data?.name) client.commands.set(cmd.data.name, cmd);
}

// Load events
const evtDir = path.join(__dirname, 'events');
for (const file of fs.readdirSync(evtDir).filter(f => f.endsWith('.js'))) {
  const evt = require(path.join(evtDir, file));
  const handler = (...args) => evt.execute(...args, client);
  if (evt.once) client.once(evt.name, handler); else client.on(evt.name, handler);
}

process.on('unhandledRejection', e => console.error('[unhandledRejection]', e));
process.on('uncaughtException', e => console.error('[uncaughtException]', e));

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('[mongo] connected');
    await client.login(process.env.DISCORD_BOT_TOKEN);
  } catch (err) {
    console.error('[boot] failed', err);
    process.exit(1);
  }
})();
