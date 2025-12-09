// Type definitions for @eliware/discord
// Project: https://github.com/eliware/discord
// Definitions by: Eli Sterling, eliware.org <https://github.com/eliware>
// TypeScript Version: 4.5

import type { Client, ClientOptions } from 'discord.js';
import type { Logger } from '@eliware/log';

export interface CreateDiscordOptions {
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
  partials?: string[];
  context?: Record<string, any>;
  clientOptions?: ClientOptions;
  ClientClass?: typeof Client;
  setupEventsFn?: (options: any) => Promise<any>;
  setupCommandsFn?: (options: any) => Promise<any>;
  registerCommandsFn?: (options: any) => Promise<boolean>;
  setupLocalesFn?: (options: any) => any;
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
