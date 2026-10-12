import type { Logger } from "@eliware/log";

export interface PurgeCommandsOptions {
  clientId?: string;
  token?: string;
  guildId?: string | null;
  log?: Logger;
  restClass?: new (options: { version: string }) => {
    setToken(token: string): { put(route: unknown, body: unknown): Promise<unknown> };
  };
  routes?: Record<string, (...args: string[]) => unknown>;
}

export function purgeCommands(options?: PurgeCommandsOptions): Promise<void>;
