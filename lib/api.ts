import { AGENT_RUNS, CAPABILITIES, WORKSPACE_CONTEXT } from "./agent";
import type { SyncChange } from "./domain";

/** Stable UI boundary; replace these resolvers with HTTP/WebSocket adapters later. */
export interface SyncCodeApi {
  getProject(): Promise<typeof WORKSPACE_CONTEXT>;
  getChanges(): Promise<SyncChange[]>;
  getChange(id: string): Promise<SyncChange | undefined>;
  getAgentRun(id: string): Promise<(typeof AGENT_RUNS)[number] | undefined>;
  getCapabilities(): Promise<typeof CAPABILITIES>;
}

export function createMemorySyncCodeApi(changes: SyncChange[]): SyncCodeApi {
  return {
  getProject: async () => WORKSPACE_CONTEXT,
  getChanges: async () => changes,
  getChange: async (id) => changes.find((change) => change.id === id),
  getAgentRun: async (id) => AGENT_RUNS.find((run) => run.id === id),
  getCapabilities: async () => CAPABILITIES,
  };
}
