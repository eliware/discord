import type { Logger } from "@eliware/log";

export interface PurgeCommandsOptions {
  clientId?: string;
  token?: string;
  guildId?: string | null;
  log?: Logger;
}

export function purgeCommands(options?: PurgeCommandsOptions): Promise<void>;
