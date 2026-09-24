import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { controlApi } from '../controlApi.js';
import { canRunControlActions } from '../permissions.js';

export const data = new SlashCommandBuilder()
  .setName('app')
  .setDescription('Manage Nebulah-connected apps and services')
  .addSubcommand((sub) => sub.setName('list').setDescription('List connected apps'))
  .addSubcommand((sub) => sub
    .setName('status')
    .setDescription('Check an app status')
    .addStringOption((option) => option.setName('id').setDescription('Integration ID').setRequired(true)))
  .addSubcommand((sub) => sub
    .setName('action')
    .setDescription('Run an approved app action')
    .addStringOption((option) => option.setName('id').setDescription('Integration ID').setRequired(true))
    .addStringOption((option) => option.setName('name').setDescription('Approved action name').setRequired(true)));

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const subcommand = interaction.options.getSubcommand();

  if (subcommand === 'list') {
    const { integrations } = await controlApi.listIntegrations();
    const lines = integrations.map((item) => `• **${item.displayName}** (\`${item.id}\`) — ${item.description}`);
    await interaction.reply({ content: lines.join('\n') || 'No integrations registered.', ephemeral: true });
    return;
  }

  if (subcommand === 'status') {
    const id = interaction.options.getString('id', true);
    const status = await controlApi.getStatus(id);
    await interaction.reply({ content: `**${id}**: ${status.state}${status.message ? ` — ${status.message}` : ''}`, ephemeral: true });
    return;
  }

  if (!canRunControlActions(interaction)) {
    await interaction.reply({ content: 'You do not have permission to run control actions.', ephemeral: true });
    return;
  }

  const id = interaction.options.getString('id', true);
  const action = interaction.options.getString('name', true);
  const result = await controlApi.runAction(id, action, interaction.user.id);
  await interaction.reply({ content: `${result.ok ? '✅' : '❌'} ${result.message}\nRequest: \`${result.requestId}\``, ephemeral: true });
}
