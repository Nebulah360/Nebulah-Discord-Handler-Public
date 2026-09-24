import type { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { discordAdminRoleIds } from '@nebulah/config';

export function canRunControlActions(interaction: ChatInputCommandInteraction): boolean {
  if (!interaction.inCachedGuild()) return false;
  if (interaction.guild.ownerId === interaction.user.id) return true;

  const member = interaction.member as GuildMember;
  return discordAdminRoleIds.some((roleId) => member.roles.cache.has(roleId));
}
