import type { NebulahIntegration } from './types.js';

export class IntegrationRegistry {
  private readonly integrations = new Map<string, NebulahIntegration>();

  register(integration: NebulahIntegration): void {
    if (this.integrations.has(integration.id)) {
      throw new Error(`Integration already registered: ${integration.id}`);
    }
    this.integrations.set(integration.id, integration);
  }

  get(id: string): NebulahIntegration | undefined {
    return this.integrations.get(id);
  }

  list(): NebulahIntegration[] {
    return [...this.integrations.values()];
  }
}
