// Type definitions for Discord command setup and registration
import type { Logger } from '@eliware/log';
import type { REST } from '@discordjs/rest';
import type { Routes } from 'discord.js';

export interface SetupCommandsOptions {
  client?: any;
  commandsDir: string;
  log?: Logger;
  msg?: string;
  fsLib?: {
    readdirSync: (...args: any[]) => string[];
    readFileSync: (...args: any[]) => string;
    existsSync: (...args: any[]) => boolean;
  };
  importFn?: (path: string) => Promise<any>;
}

export interface RegisterCommandsOptions {
  commandDefs: any[];
  clientId?: string;
  token?: string;
  log?: Logger;
  restClass?: typeof REST;
  routes?: typeof Routes;
}

export interface PurgeCommandsOptions {
  clientId?: string;
  token?: string;
  guildId?: string | null;
  log?: Logger;
  restClass?: typeof REST;
  routes?: typeof Routes;
}

export interface CommandHandlers {
  [key: string]: (...args: any[]) => any;
}

export interface SetupCommandsResult {
  commandDefs: any[];
  commandHandlers: CommandHandlers;
}

export function setupCommands(options: SetupCommandsOptions): Promise<SetupCommandsResult>;

export function registerCommands(options: RegisterCommandsOptions): Promise<boolean>;

export function purgeCommands(options: PurgeCommandsOptions): Promise<void>;
