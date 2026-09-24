# Nebulah Discord Bot

Nebulah Discord Bot is the Discord-facing control plane for the Nebulah software suite.

It is designed to provide a secure Discord interface for Nebulah web apps, APIs, GitHub automation, community services and future mobile/desktop applications.

## Repository pair

- Private development: `Nebulah360/Nebulah-Discord-Handler`
- Public stable: `Nebulah360/Nebulah-Discord-Handler-Public`

The public repository receives stable snapshots only.

## Initial features

- Discord.js slash-command bot
- Fastify control API
- typed integration/plugin contract
- service status commands
- allowlisted control actions
- Discord role authorization
- request/audit IDs for mutations
- Docker Compose development environment
- GitHub Actions CI
- stable-release sync workflow for the public repository

## Commands

Current MVP command surface:

```text
/app list
/app status id:<integration>
/app action id:<integration> name:<approved-action>
```

The included `nebulah-api` integration exposes a harmless `ping` action as an example.

## Setup

Requirements:

- Node.js 22+
- pnpm 10+
- a Discord application/bot

Copy the environment template:

```bash
cp .env.example .env
```

Set at least:

```env
DISCORD_TOKEN=...
DISCORD_CLIENT_ID=...
DISCORD_GUILD_ID=...
DISCORD_ADMIN_ROLE_IDS=role_id_1,role_id_2
CONTROL_API_TOKEN=use-a-long-random-secret
```

Install and register the slash command:

```bash
corepack enable
pnpm install
pnpm --filter @nebulah/discord-bot register
pnpm dev
```

## Adding a web app

Create an implementation of `NebulahIntegration` and register it with the Control API registry. The integration can call the application's authenticated REST API, GraphQL endpoint, webhook system, deployment provider or another explicitly approved backend.

Avoid adding commands that execute arbitrary shell input or arbitrary URLs supplied by Discord users.

## Stable public releases

`.github/workflows/publish-public.yml` pushes a clean snapshot to `Nebulah360/Nebulah-Discord-Handler-Public` when a release is published.

The private repository needs a GitHub Actions secret named:

```text
PUBLIC_REPO_TOKEN
```

The token must have write access to the public repository. Use the narrowest permissions possible.

## Planned integrations

- Nebulah Dash
- GitHub releases/issues/workflows
- web app health and deployment controls
- SNET/community services
- webhook-driven Discord notifications
- administrative web dashboard
- mobile companion applications

## License

MIT unless a future component requires a compatible alternative license.
