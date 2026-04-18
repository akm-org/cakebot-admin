# CakeBot — Production Discord Bot

discord.js v14 + MongoDB + Gemini AI moderation + tickets + levels + anti-raid + Bedrock status.

## Run locally
1. `cp .env.example .env` and fill values
2. `npm install`
3. `npm run deploy` (registers slash commands globally)
4. `npm start`

## Deploy on Railway
1. Push to GitHub
2. New Project → Deploy from repo
3. Add the env vars from `.env.example` in Railway → Variables
4. Run `npm run deploy` once via Railway shell to register commands

## Architecture
- `index.js` — bootstrap, mongoose connect, command/event loaders
- `commands/` — slash commands (auto-loaded)
- `events/` — gateway event handlers (auto-loaded)
- `systems/` — automod, antiraid, leveling, tickets, logging, file-protect
- `models/` — mongoose schemas
- `utils/` — gemini client, helpers
