require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = [];
const cmdDir = path.join(__dirname, 'commands');
for (const file of fs.readdirSync(cmdDir).filter(f => f.endsWith('.js'))) {
  const cmd = require(path.join(cmdDir, file));
  if (cmd?.data) commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);
(async () => {
  try {
    console.log(`Registering ${commands.length} commands...`);
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
    console.log('Done.');
  } catch (e) { console.error(e); process.exit(1); }
})();
