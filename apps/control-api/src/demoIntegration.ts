import type { NebulahIntegration } from '@nebulah/core';

export const demoIntegration: NebulahIntegration = {
  id: 'nebulah-api',
  displayName: 'Nebulah API',
  description: 'Example managed service. Replace this with a real web app integration.',
  async status() {
    return {
      state: 'online',
      message: 'Control API is running.',
      checkedAt: new Date().toISOString()
    };
  },
  actions: {
    ping: {
      description: 'Run a harmless connectivity test.',
      async run(_input, context) {
        return {
          ok: true,
          message: `Pong. Request ${context.requestId}`
        };
      }
    }
  }
};
