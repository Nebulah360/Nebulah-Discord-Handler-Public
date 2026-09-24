import { env } from '@nebulah/config';

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${env.CONTROL_API_URL}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${env.CONTROL_API_TOKEN}`,
      'content-type': 'application/json',
      ...(init.headers ?? {})
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Control API ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

export interface IntegrationSummary {
  id: string;
  displayName: string;
  description: string;
  actions: Array<{ name: string; description: string; destructive: boolean }>;
}

export const controlApi = {
  listIntegrations: () => request<{ integrations: IntegrationSummary[] }>('/v1/integrations'),
  getStatus: (id: string) => request<{ state: string; message?: string; checkedAt: string }>(`/v1/integrations/${encodeURIComponent(id)}/status`),
  runAction: (id: string, action: string, actorId: string, input: unknown = {}) => request<{ ok: boolean; message: string; requestId: string }>(
    `/v1/integrations/${encodeURIComponent(id)}/actions/${encodeURIComponent(action)}`,
    {
      method: 'POST',
      headers: {
        'x-nebulah-actor-id': actorId,
        'x-nebulah-actor-source': 'discord'
      },
      body: JSON.stringify(input)
    }
  )
};
