# Architecture

Nebulah Discord Bot is a control plane, not a collection of arbitrary shell commands.

## Flow

Discord -> Discord Bot -> authenticated Control API -> registered integration -> external app/service API

External webhooks can later flow in the opposite direction:

GitHub / Nebulah services / community services -> webhook receiver -> event bus -> Discord notification

## Security rules

1. Never expose arbitrary URL fetching to Discord users.
2. Never expose arbitrary shell execution as a Discord command.
3. Every remote action must be explicitly registered by an integration.
4. Destructive actions should require a second confirmation step before production use.
5. Authorization is enforced at the Discord layer and should also be enforced by each service.
6. Service secrets stay server-side in environment variables or a secrets manager.
7. Record actor ID, source, request ID, target integration and action for every mutation.

## Integration contract

Every integration provides:

- a unique ID
- status reporting
- a set of named, documented actions
- action handlers with an actor/request context

This lets future Nebulah web apps, mobile apps, APIs, GitHub workflows and community services plug into the same control layer.
