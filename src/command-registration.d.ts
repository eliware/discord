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

export interface PurgeCommandsOptions {
  clientId?: string;
  token?: string;
  guildId?: string | null;
  log?: Logger;
  restClass?: RegisterCommandsOptions["restClass"];
  routes?: RegisterCommandsOptions["routes"];
}

export function registerCommands(options: RegisterCommandsOptions): Promise<boolean>;
export function purgeCommands(options?: PurgeCommandsOptions): Promise<void>;
