import Fastify from 'fastify';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { env } from '@nebulah/config';
import { IntegrationRegistry } from '@nebulah/core';
import { demoIntegration } from './demoIntegration.js';

const app = Fastify({ logger: true });
const registry = new IntegrationRegistry();
registry.register(demoIntegration);

function tokenMatches(headerValue: string | undefined): boolean {
  if (!headerValue?.startsWith('Bearer ')) return false;
  const provided = Buffer.from(headerValue.slice(7));
  const expected = Buffer.from(env.CONTROL_API_TOKEN);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

app.addHook('onRequest', async (request, reply) => {
  if (request.url === '/health') return;
  if (!tokenMatches(request.headers.authorization)) {
    return reply.code(401).send({ error: 'unauthorized' });
  }
});

app.get('/health', async () => ({
  ok: true,
  service: 'nebulah-control-api',
  time: new Date().toISOString()
}));

app.get('/v1/integrations', async () => ({
  integrations: registry.list().map(({ id, displayName, description, actions }) => ({
    id,
    displayName,
    description,
    actions: Object.entries(actions).map(([name, action]) => ({
      name,
      description: action.description,
      destructive: Boolean(action.destructive)
    }))
  }))
}));

app.get('/v1/integrations/:id/status', async (request, reply) => {
  const { id } = request.params as { id: string };
  const integration = registry.get(id);
  if (!integration) return reply.code(404).send({ error: 'integration_not_found' });
  return integration.status();
});

app.post('/v1/integrations/:id/actions/:action', async (request, reply) => {
  const { id, action: actionName } = request.params as { id: string; action: string };
  const integration = registry.get(id);
  if (!integration) return reply.code(404).send({ error: 'integration_not_found' });

  const action = integration.actions[actionName];
  if (!action) return reply.code(404).send({ error: 'action_not_found' });

  const actorId = String(request.headers['x-nebulah-actor-id'] ?? 'unknown');
  const actorSource = String(request.headers['x-nebulah-actor-source'] ?? 'system');
  if (!['discord', 'web', 'system'].includes(actorSource)) {
    return reply.code(400).send({ error: 'invalid_actor_source' });
  }

  const requestId = randomUUID();
  request.log.info({ requestId, actorId, actorSource, id, actionName }, 'integration action requested');

  const result = await action.run(request.body, {
    actorId,
    actorSource: actorSource as 'discord' | 'web' | 'system',
    requestId
  });

  return { requestId, ...result };
});

await app.listen({ host: env.CONTROL_API_HOST, port: env.CONTROL_API_PORT });
