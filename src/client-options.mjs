import { GatewayIntentBits, Partials } from "discord.js";
import { validateBooleanMap } from "./validation.mjs";

const DEFAULT_INTENTS = {
  Guilds: false,
  GuildMembers: false,
  GuildModeration: false,
  GuildExpressions: false,
  GuildIntegrations: false,
  GuildWebhooks: false,
  GuildInvites: false,
  GuildVoiceStates: false,
  GuildPresences: false,
  GuildMessages: false,
  GuildMessageReactions: false,
  GuildMessageTyping: false,
  DirectMessages: false,
  DirectMessageReactions: false,
  DirectMessageTyping: false,
  MessageContent: false,
  GuildScheduledEvents: false,
  AutoModerationConfiguration: false,
  AutoModerationExecution: false,
  GuildMessagePolls: false,
  DirectMessagePolls: false,
};

const INTENT_MAP = {
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

const DEFAULT_PARTIALS = { Message: true, Channel: true, Reaction: true };
const PARTIALS_MAP = {
  Message: Partials.Message,
  Channel: Partials.Channel,
  Reaction: Partials.Reaction,
  GuildMember: Partials.GuildMember,
  User: Partials.User,
  ThreadMember: Partials.ThreadMember,
  GuildScheduledEvent: Partials.GuildScheduledEvent,
};

export const createClientOptions = (intents, partials, clientOptions = {}) => {
  validateBooleanMap(intents, new Set(Object.keys(INTENT_MAP)), "intents");
  validateBooleanMap(partials, new Set(Object.keys(PARTIALS_MAP)), "partials");
  const resolvedIntents = Object.entries({ ...DEFAULT_INTENTS, ...intents })
    .filter(([key, enabled]) => enabled && INTENT_MAP[key])
    .map(([key]) => INTENT_MAP[key]);
  const resolvedPartials = Object.entries({ ...DEFAULT_PARTIALS, ...partials })
    .filter(([key, enabled]) => enabled && PARTIALS_MAP[key])
    .map(([key]) => PARTIALS_MAP[key]);
  return { intents: resolvedIntents, partials: resolvedPartials, ...clientOptions };
};
