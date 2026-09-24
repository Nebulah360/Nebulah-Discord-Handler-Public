import { Client, Events, GatewayIntentBits } from 'discord.js';
import { env } from '@nebulah/config';
import { execute as executeAppCommand } from './commands/app.js';

if (!env.DISCORD_TOKEN) {
  throw new Error('DISCORD_TOKEN is required.');
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Nebulah Discord Bot logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === 'app') {
      await executeAppCommand(interaction);
    }
  } catch (error) {
    console.error(error);
    const message = 'The command failed. Check the bot logs for the request details.';
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: message, ephemeral: true });
    } else {
      await interaction.reply({ content: message, ephemeral: true });
    }
  }
});

await client.login(env.DISCORD_TOKEN);
