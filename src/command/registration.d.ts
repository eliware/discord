import type { Logger } from "@eliware/log";

export interface RegisterCommandsOptions {
  commandDefs: unknown[];
  clientId?: string;
  token?: string;
  log?: Logger;
  restClass?: new (options: { version: string }) => {
    setToken(token: string): {
      get(route: unknown): Promise<Array<{ id: string; name: string; type?: number }>>;
      post(route: unknown, options: unknown): Promise<unknown>;
      put(route: unknown, options: unknown): Promise<unknown>;
    };
  };
  routes?: Record<string, (...args: string[]) => unknown>;
}

export function registerCommands(options: RegisterCommandsOptions): Promise<boolean>;
