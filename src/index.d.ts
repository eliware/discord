import type { Client, ClientOptions } from "discord.js";
import type { Logger } from "@eliware/log";

export type { PurgeCommandsOptions } from "./command/purge.d.ts";
export { splitMsg } from "./split-msg.js";

export type DiscordClient = Client & { shutdown: () => Promise<void> };
export type CommandHandler = (
  context: EventHandlerContext,
  ...args: unknown[]
) => unknown | Promise<unknown>;

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

export interface CreateDiscordOptions {
  clientId?: string;
  token?: string;
  log?: Logger;
  rootDir?: string;
  localesDir?: string;
  commandsDir?: string;
  eventsDir?: string;
  intents?: Partial<
    Record<
      | "Guilds"
      | "GuildMembers"
      | "GuildModeration"
      | "GuildExpressions"
      | "GuildIntegrations"
      | "GuildWebhooks"
      | "GuildInvites"
      | "GuildVoiceStates"
      | "GuildPresences"
      | "GuildMessages"
      | "GuildMessageReactions"
      | "GuildMessageTyping"
      | "DirectMessages"
      | "DirectMessageReactions"
      | "DirectMessageTyping"
      | "MessageContent"
      | "GuildScheduledEvents"
      | "AutoModerationConfiguration"
      | "AutoModerationExecution"
      | "GuildMessagePolls"
      | "DirectMessagePolls",
      boolean
    >
  >;
  partials?: Partial<
    Record<
      | "Message"
      | "Channel"
      | "Reaction"
      | "GuildMember"
      | "User"
      | "ThreadMember"
      | "GuildScheduledEvent",
      boolean
    >
  >;
  context?: Record<string, unknown>;
  clientOptions?: ClientOptions;
  enabled?: boolean;
  signals?: boolean;
  signalOptions?: Record<string, unknown>;
  processHandlers?: boolean;
  processHandlerOptions?: Record<string, unknown>;
}

export function createDiscord(options?: CreateDiscordOptions): Promise<DiscordClient | null>;
