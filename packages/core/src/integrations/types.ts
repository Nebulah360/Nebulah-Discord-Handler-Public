export type IntegrationState = 'online' | 'degraded' | 'offline' | 'unknown';

export interface IntegrationStatus {
  state: IntegrationState;
  message?: string;
  checkedAt: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface ActionContext {
  actorId: string;
  actorSource: 'discord' | 'web' | 'system';
  requestId: string;
}

export interface ActionResult {
  ok: boolean;
  message: string;
  data?: unknown;
}

export interface IntegrationAction {
  description: string;
  destructive?: boolean;
  run(input: unknown, context: ActionContext): Promise<ActionResult>;
}

export interface NebulahIntegration {
  id: string;
  displayName: string;
  description: string;
  status(): Promise<IntegrationStatus>;
  actions: Record<string, IntegrationAction>;
}
