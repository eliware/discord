import type { Logger } from "@eliware/log";

export interface RegisterCommandsOptions {
  commandDefs: unknown[];
  clientId?: string;
  token?: string;
  log?: Logger;
  restClass?: new (options: { version: string }) => {
    setToken(token: string): { put(route: unknown, body: unknown): Promise<unknown> };
  };
  routes?: Record<string, (...args: string[]) => unknown>;
}

export function registerCommands(options: RegisterCommandsOptions): Promise<boolean>;
