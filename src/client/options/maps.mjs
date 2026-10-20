import { GatewayIntentBits, Partials } from "discord.js";

export const INTENT_MAP = {
  Guilds: GatewayIntentBits.Guilds,
  GuildMembers: GatewayIntentBits.GuildMembers,
  GuildModeration: GatewayIntentBits.GuildModeration,
  GuildExpressions: GatewayIntentBits.GuildExpressions,
  GuildIntegrations: GatewayIntentBits.GuildIntegrations,
  GuildWebhooks: GatewayIntentBits.GuildWebhooks,
  GuildInvites: GatewayIntentBits.GuildInvites,
  GuildVoiceStates: GatewayIntentBits.GuildVoiceStates,
  GuildPresences: GatewayIntentBits.GuildPresences,
  GuildMessages: GatewayIntentBits.GuildMessages,
  GuildMessageReactions: GatewayIntentBits.GuildMessageReactions,
  GuildMessageTyping: GatewayIntentBits.GuildMessageTyping,
  DirectMessages: GatewayIntentBits.DirectMessages,
  DirectMessageReactions: GatewayIntentBits.DirectMessageReactions,
  DirectMessageTyping: GatewayIntentBits.DirectMessageTyping,
  MessageContent: GatewayIntentBits.MessageContent,
  GuildScheduledEvents: GatewayIntentBits.GuildScheduledEvents,
  AutoModerationConfiguration: GatewayIntentBits.AutoModerationConfiguration,
  AutoModerationExecution: GatewayIntentBits.AutoModerationExecution,
  GuildMessagePolls: GatewayIntentBits.GuildMessagePolls,
  DirectMessagePolls: GatewayIntentBits.DirectMessagePolls,
};

export const PARTIALS_MAP = {
  Message: Partials.Message,
  Channel: Partials.Channel,
  Reaction: Partials.Reaction,
  GuildMember: Partials.GuildMember,
  User: Partials.User,
  ThreadMember: Partials.ThreadMember,
  GuildScheduledEvent: Partials.GuildScheduledEvent,
};

export const DEFAULT_INTENTS = Object.fromEntries(
  Object.keys(INTENT_MAP).map((key) => [key, false]),
);
export const DEFAULT_PARTIALS = { Message: true, Channel: true, Reaction: true };
