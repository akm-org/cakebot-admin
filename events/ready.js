module.exports = { name: 'ready', once: true, async execute(client) {
  console.log(`[ready] ${client.user.tag} on ${client.guilds.cache.size} guilds`);
  client.user.setPresence({ activities: [{ name: '/cakebot' }], status: 'online' });
}};
