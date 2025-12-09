import path from '@eliware/path';
import logger from '@eliware/log';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { setupEvents } from './src/events.mjs';
import { setupCommands, registerCommands } from './src/commands.mjs';
import { setupLocales } from './src/locales.mjs';

/**
 * Creates and logs in a Discord client, allowing dependency injection for testability.
 *
 * @param {Object} options - Configuration options
 * @param {string} [options.client_id] - Discord application client ID
 * @param {string} [options.token] - Discord app token
 * @param {Object} [options.log] - Logger instance
 * @param {string} [options.rootDir] - Root directory for events, commands, and locales
 * @param {string} [options.localesDir] - Directory path for locales (overrides rootDir)
 * @param {string} [options.commandsDir] - Directory path for commands (overrides rootDir)
 * @param {string} [options.eventsDir] - Directory path for events (overrides rootDir)
 * @param {Object} [options.intents] - Object with boolean flags for Discord Gateway Intents (e.g., { Guilds: true, GuildMessages: true })
 * @param {Array<string>} [options.partials] - Array of partials for the Discord client
 * @param {Object} [options.context] - Context object to pass to event handlers and commands
 * @param {Object} [options.clientOptions] - Additional options for Discord client
 * @param {Function} [options.ClientClass] - Discord client class (for dependency injection/testing)
 * @param {Function} [options.setupEventsFn] - Function to set up events (for dependency injection/testing)
 * @param {Function} [options.setupCommandsFn] - Function to set up commands (for dependency injection/testing)
 * @param {Function} [options.registerCommandsFn] - Function to register commands (for dependency injection/testing)
 * @param {Function} [options.setupLocalesFn] - Function to set up locales (for dependency injection/testing)
 * @returns {Promise<import('discord.js').Client>} Discord client instance
 */
const DEFAULT_INTENTS = {
  Guilds: true,
  GuildMembers: false, // privileged
  GuildModeration: true,
  GuildExpressions: true,
  GuildIntegrations: true,
  GuildWebhooks: true,
  GuildInvites: true,
  GuildVoiceStates: true,
  GuildPresences: false, // privileged
  GuildMessages: true,
  GuildMessageReactions: true,
  GuildMessageTyping: true,
  DirectMessages: true,
  DirectMessageReactions: true,
  DirectMessageTyping: true,
  MessageContent: false, // privileged
  GuildScheduledEvents: true,
  AutoModerationConfiguration: true,
  AutoModerationExecution: true,
  GuildMessagePolls: true,
  DirectMessagePolls: true
};

const DEFAULT_PARTIALS = {
  Message: true,
  Channel: true,
  Reaction: true
};

const PARTIALS_MAP = {
  Message: Partials.Message,
  Channel: Partials.Channel,
  Reaction: Partials.Reaction,
  GuildMember: Partials.GuildMember,
  User: Partials.User,
  ThreadMember: Partials.ThreadMember,
  GuildScheduledEvent: Partials.GuildScheduledEvent
};

export const createDiscord = async ({
  client_id = process.env.DISCORD_CLIENT_ID,
  token = process.env.DISCORD_TOKEN,
  log = logger,
  rootDir = path(import.meta),
  localesDir = path(rootDir, 'locales'),
  commandsDir = path(rootDir, 'commands'),
  eventsDir = path(rootDir, 'events'),
  intents = undefined,
  partials = undefined,
  context = {},
  clientOptions = {},
  ClientClass = Client,
  setupEventsFn = setupEvents,
  setupCommandsFn = setupCommands,
  registerCommandsFn = registerCommands,
  setupLocalesFn = setupLocales,
} = {}) => {
  if (!client_id) throw new Error('DISCORD_CLIENT_ID is not set. Please check your .env file.');
  if (!token) throw new Error('DISCORD_TOKEN is not set. Please check your .env file.');

  const INTENT_MAP = {
    Guilds: GatewayIntentBits.Guilds,
    GuildMembers: GatewayIntentBits.GuildMembers,
    GuildModeration: GatewayIntentBits.GuildModeration,
    GuildBans: GatewayIntentBits.GuildBans,
    GuildExpressions: GatewayIntentBits.GuildExpressions,
    GuildEmojisAndStickers: GatewayIntentBits.GuildEmojisAndStickers,
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
    DirectMessagePolls: GatewayIntentBits.DirectMessagePolls
  };

  // Merge user intents with defaults
  const mergedIntents = { ...DEFAULT_INTENTS, ...(intents || {}) };
  const resolvedIntents = Object.entries(mergedIntents)
    .filter(([key, value]) => value && INTENT_MAP[key])
    .map(([key]) => INTENT_MAP[key]);

  // Merge user partials with defaults and map to Partials enum
  const mergedPartials = { ...DEFAULT_PARTIALS, ...(partials || {}) };
  const resolvedPartials = Object.entries(mergedPartials)
    .filter(([key, value]) => value && PARTIALS_MAP[key])
    .map(([key]) => PARTIALS_MAP[key]);

  const client = new ClientClass({
    intents: resolvedIntents,
    partials: resolvedPartials,
    ...clientOptions
  });

  const { msg, loadedLocales } = await setupLocalesFn({ localesDir, log });
  const { commandDefs, commandHandlers } = await setupCommandsFn({ client, commandsDir, log, msg });
  let registerSuccess = true;
  if (commandDefs && commandDefs.length > 0) {
    registerSuccess = await registerCommandsFn({ commandDefs, client_id, token, log });
    if (!registerSuccess) throw new Error('Failed to register commands with Discord API. Please check your command definitions and token.');
  } else {
    log.warn('No commands to register.');
  }
  const { loadedEvents } = await setupEventsFn({ client, eventsDir, log, msg, commandHandlers, context });
  log.info(`Loaded ${loadedEvents.length} event(s), ${loadedLocales.length} locale(s), and ${commandDefs ? Object.keys(commandDefs).length : 0} command(s).`);
  try {
    await client.login(token);
  } catch (error) {
    throw new Error(`Failed to log in to Discord: ${error.message}`);
  }
  return client;
};

/**
 * Splits a message into chunks of up to maxLength characters, attempting to split at newlines or periods for readability.
 *
 * @param {string} msg - The message to split
 * @param {number} [maxLength=2000] - The maximum length of each chunk (default: 2000)
 * @returns {string[]} An array of message chunks, each no longer than maxLength
 */
export function splitMsg(msg, maxLength = 2000) {
    msg = msg.trim();
    if (msg === '') return [];
    if (msg.length <= maxLength) return [msg];
    const chunks = [];
    while (msg.length > maxLength) {
        let chunk = msg.slice(0, maxLength);
        let splitIndex = chunk.lastIndexOf('\n');
        if (splitIndex === -1) splitIndex = chunk.lastIndexOf('.');
        if (splitIndex === -1 || splitIndex < 1) splitIndex = maxLength;
        else splitIndex++;
        let part = msg.slice(0, splitIndex).trim();
        chunks.push(part);
        msg = msg.slice(splitIndex).trim();
    }
    if (msg !== '') chunks.push(msg);
    return chunks;
}