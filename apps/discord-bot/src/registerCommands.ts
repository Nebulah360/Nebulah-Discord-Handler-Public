import { REST, Routes } from 'discord.js';
import { env } from '@nebulah/config';
import { data as appCommand } from './commands/app.js';

if (!env.DISCORD_TOKEN || !env.DISCORD_CLIENT_ID) {
  throw new Error('DISCORD_TOKEN and DISCORD_CLIENT_ID are required to register commands.');
}

const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
const body = [appCommand.toJSON()];

if (env.DISCORD_GUILD_ID) {
  await rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID), { body });
  console.log('Registered guild commands.');
} else {
  await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body });
  console.log('Registered global commands.');
}
