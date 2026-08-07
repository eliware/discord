// Type definitions for @eliware/discord
// Project: https://github.com/eliware/discord
// Definitions by: Eli Sterling, eliware.org <https://github.com/eliware>
// TypeScript Version: 4.5

import type { Client, ClientOptions } from 'discord.js';
import type { Logger } from '@eliware/common';

export type CommandHandler = (context: EventHandlerContext, ...args: unknown[]) => unknown | Promise<unknown>;

export interface EventHandlerContext {
  client: Client;
  log: Logger;
  msg: (locale: string, key: string, defaultValue?: string) => string;
  commandHandlers?: Record<string, CommandHandler>;
  [key: string]: unknown;
}

export interface CommandDefinition {
  name: string;
  description: string;
  options?: readonly Record<string, unknown>[];
  [key: string]: unknown;
}

export interface SetupLocalesResult {
  msg: (locale: string, key: string, defaultValue?: string, log?: Logger) => string;
  loadedLocales: string[];
}

export interface SetupCommandsResult {
  commandDefs: CommandDefinition[];
  commandHandlers: Record<string, CommandHandler>;
}

export interface SetupEventsResult {
  loadedEvents: string[];
  cleanup: () => void;
}

export interface CreateDiscordOptions {
  clientId?: string;
  /** Deprecated compatibility alias for clientId. */
  client_id?: string;
  token?: string;
  log?: Logger;
  rootDir?: string;
  localesDir?: string;
  commandsDir?: string;
  eventsDir?: string;
  intents?: {
    Guilds?: boolean;
    GuildMembers?: boolean; // privileged
    GuildModeration?: boolean;
    GuildBans?: boolean; // deprecated alias
    GuildExpressions?: boolean;
    GuildEmojisAndStickers?: boolean; // deprecated alias
    GuildIntegrations?: boolean;
    GuildWebhooks?: boolean;
    GuildInvites?: boolean;
    GuildVoiceStates?: boolean; // privileged
    GuildPresences?: boolean; // privileged
    GuildMessages?: boolean;
    GuildMessageReactions?: boolean;
    GuildMessageTyping?: boolean;
    DirectMessages?: boolean;
    DirectMessageReactions?: boolean;
    DirectMessageTyping?: boolean;
    MessageContent?: boolean; // privileged
    GuildScheduledEvents?: boolean;
    AutoModerationConfiguration?: boolean;
    AutoModerationExecution?: boolean;
    GuildMessagePolls?: boolean;
    DirectMessagePolls?: boolean;
    [key: string]: boolean | undefined;
  };
  partials?: Partial<Record<'Message' | 'Channel' | 'Reaction' | 'GuildMember' | 'User' | 'ThreadMember' | 'GuildScheduledEvent', boolean>>;
  context?: Record<string, unknown>;
  clientOptions?: ClientOptions;
  ClientClass?: typeof Client;
  setupEventsFn?: (options: unknown) => Promise<SetupEventsResult>;
  setupCommandsFn?: (options: unknown) => Promise<SetupCommandsResult>;
  registerCommandsFn?: (options: unknown) => Promise<boolean>;
  setupLocalesFn?: (options: unknown) => SetupLocalesResult;
  signals?: boolean;
  signalOptions?: Record<string, unknown>;
  processHandlers?: boolean;
  processHandlerOptions?: Record<string, unknown>;
}

/**
 * Creates and logs in a Discord client, allowing dependency injection for testability.
 * @param options Configuration options for the Discord client
 * @returns Promise resolving to a Discord.js Client instance
 */
export function createDiscord(options?: CreateDiscordOptions): Promise<Client>;

/**
 * Splits a message into chunks of up to maxLength characters, attempting to split at newlines or periods for readability.
 *
 * @param msg The message to split
 * @param maxLength The maximum length of each chunk (default: 2000)
 * @returns An array of message chunks, each no longer than maxLength
 */
export function splitMsg(msg: string, maxLength?: number): string[];

export function shutdownDiscord(client: Client, options?: { cleanupEvents?: () => void; clearLocalesFn?: () => void }): Promise<void>;
