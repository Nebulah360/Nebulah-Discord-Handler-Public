import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.string().default('info'),
  DISCORD_TOKEN: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_GUILD_ID: z.string().optional(),
  DISCORD_ADMIN_ROLE_IDS: z.string().default(''),
  CONTROL_API_HOST: z.string().default('0.0.0.0'),
  CONTROL_API_PORT: z.coerce.number().int().positive().default(8787),
  CONTROL_API_URL: z.string().url().default('http://127.0.0.1:8787'),
  CONTROL_API_TOKEN: z.string().min(16).default('change-me-change-me')
});

export const env = schema.parse(process.env);

export const discordAdminRoleIds = env.DISCORD_ADMIN_ROLE_IDS
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
