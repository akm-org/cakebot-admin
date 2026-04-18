const { getSettings } = require('../utils/settings');
const Warn = require('../models/Warn');
const { log } = require('../utils/logger');

const recent = new Map(); // userId -> timestamps
const INVITE_RE = /(discord\.gg|discord(?:app)?\.com\/invite)\/[a-z0-9-]+/i;
const URL_RE = /(https?:\/\/[^\s]+)/gi;
const BAD_EXT = ['.exe','.bat','.cmd','.scr','.msi','.zip','.rar','.7z','.pdf','.jar','.vbs'];

async function check(message) {
  if (!message.guild || message.author.bot) return;
  const s = await getSettings(message.guildId);
  if (!s.modules.autoMod && !s.modules.fileProtect) return;

  // File protection
  if (s.modules.fileProtect && message.attachments.size) {
    for (const att of message.attachments.values()) {
      const name = (att.name || '').toLowerCase();
      if (BAD_EXT.some(x => name.endsWith(x))) {
        await message.delete().catch(() => {});
        await message.channel.send({ content: `${message.author}, file type \`${name.split('.').pop()}\` is blocked.` }).catch(() => {});
        await log(message.guild, 'file_blocked', { userId: message.author.id, file: name }, s.channels.log);
        return;
      }
    }
  }

  if (!s.modules.autoMod) return;
  const c = (message.content || '').trim();

  // Spam
  const arr = (recent.get(message.author.id) || []).filter(t => Date.now() - t < 7000);
  arr.push(Date.now());
  recent.set(message.author.id, arr);
  if (arr.length > 5) {
    await message.delete().catch(() => {});
    await message.member.timeout(60_000, 'Spam').catch(() => {});
    await log(message.guild, 'spam_mute', { userId: message.author.id, count: arr.length }, s.channels.log);
    return;
  }

  // Invite blocker
  if (INVITE_RE.test(c) && !message.member.permissions.has('ManageGuild')) {
    await message.delete().catch(() => {});
    await message.channel.send({ content: `${message.author}, invite links aren't allowed.` }).catch(() => {});
    await log(message.guild, 'invite_blocked', { userId: message.author.id, content: c }, s.channels.log);
    return;
  }

  // Unknown domain
  if (s.modules.autoMod && (s.allowedDomains?.length)) {
    const urls = c.match(URL_RE) || [];
    for (const u of urls) {
      try {
        const host = new URL(u).hostname.replace(/^www\./, '');
        if (!s.allowedDomains.some(d => host === d || host.endsWith('.' + d))) {
          await message.delete().catch(() => {});
          await log(message.guild, 'link_blocked', { userId: message.author.id, host }, s.channels.log);
          return;
        }
      } catch {}
    }
  }

  // Caps
  const letters = c.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 12 && letters === letters.toUpperCase()) {
    await message.delete().catch(() => {});
    await message.channel.send({ content: `${message.author}, please don't shout.` }).catch(() => {});
    return;
  }

  // Blacklist
  if (s.blacklist?.length) {
    const lower = c.toLowerCase();
    if (s.blacklist.some(w => w && lower.includes(w.toLowerCase()))) {
      await message.delete().catch(() => {});
      await Warn.findOneAndUpdate({ userId: message.author.id, guildId: message.guildId },
        { $inc: { warns: 1 }, $push: { history: { reason: 'Blacklisted word', moderatorId: 'auto', severity: 'medium' } } },
        { upsert: true });
      await log(message.guild, 'blacklist_hit', { userId: message.author.id }, s.channels.log);
    }
  }
}
module.exports = { check };
