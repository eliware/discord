import type { Logger } from "@eliware/log";

export interface SetupCommandsOptions {
  commandsDir: string;
  log?: Logger;
  fsLib?: {
    readdirSync: (...args: unknown[]) => string[];
    readFileSync: (...args: unknown[]) => string;
    existsSync: (...args: unknown[]) => boolean;
  };
  importFn?: (url: string) => Promise<unknown>;
}

export interface SetupCommandsResult {
  commandDefs: unknown[];
  commandHandlers: Record<string, (...args: unknown[]) => unknown>;
}

export function setupCommands(options: SetupCommandsOptions): Promise<SetupCommandsResult>;
