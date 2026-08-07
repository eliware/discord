import { log as logger, path, registerHandlers, registerSignals } from '@eliware/common';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { setupEvents } from './src/events.mjs';
import { setupCommands, registerCommands } from './src/commands.mjs';
import { setupLocales, clearLocales } from './src/locales.mjs';
import { validateBooleanMap, validateContext } from './src/validation.mjs';

/**
 * Creates and logs in a Discord client, allowing dependency injection for testability.
 *
 * @param {Object} options - Configuration options
 * @param {string} [options.clientId] - Discord application client ID
 * @param {string} [options.client_id] - Deprecated compatibility alias
 * @param {string} [options.token] - Discord app token
 * @param {Object} [options.log] - Logger instance
 * @param {string} [options.rootDir] - Root directory for events, commands, and locales
 * @param {string} [options.localesDir] - Directory path for locales (overrides rootDir)
 * @param {string} [options.commandsDir] - Directory path for commands (overrides rootDir)
 * @param {string} [options.eventsDir] - Directory path for events (overrides rootDir)
 * @param {Object} [options.intents] - Object with boolean flags for Discord Gateway Intents (e.g., { Guilds: true, GuildMessages: true })
 * @param {Object<string, boolean>} [options.partials] - Partial flags for the Discord client
 * @param {Object} [options.context] - Context object to pass to event handlers and commands
 * @param {Object} [options.clientOptions] - Additional options for Discord client
 * @param {Function} [options.ClientClass] - Discord client class (for dependency injection/testing)
 * @param {Function} [options.setupEventsFn] - Function to set up events (for dependency injection/testing)
 * @param {Function} [options.setupCommandsFn] - Function to set up commands (for dependency injection/testing)
 * @param {Function} [options.registerCommandsFn] - Function to register commands (for dependency injection/testing)
 * @param {Function} [options.setupLocalesFn] - Function to set up locales (for dependency injection/testing)
 * @param {boolean} [options.signals=false] - Register graceful process signal handling
 * @param {Object} [options.signalOptions] - Options for @eliware/signals
 * @param {boolean} [options.processHandlers=false] - Register process error handlers
 * @param {Object} [options.processHandlerOptions] - Options for @eliware/errors
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

const shutdownClients = new WeakSet();

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
  clientId,
  client_id,
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
  signals = false,
  signalOptions = {},
  processHandlers = false,
  processHandlerOptions = {},
} = {}) => {
  const resolvedClientId = clientId ?? client_id ?? process.env.DISCORD_CLIENT_ID;
  if (!resolvedClientId) throw new Error('DISCORD_CLIENT_ID is not set. Please check your .env file.');
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

  validateContext(context);
  validateBooleanMap(intents, new Set(Object.keys(INTENT_MAP)), 'intents');
  validateBooleanMap(partials, new Set(Object.keys(PARTIALS_MAP)), 'partials');

  // Merge user intents with defaults
  const mergedIntents = { ...DEFAULT_INTENTS, ...intents };
  const resolvedIntents = Object.entries(mergedIntents)
    .filter(([key, value]) => value && INTENT_MAP[key])
    .map(([key]) => INTENT_MAP[key]);

  // Merge user partials with defaults and map to Partials enum
  const mergedPartials = { ...DEFAULT_PARTIALS, ...partials };
  const resolvedPartials = Object.entries(mergedPartials)
    .filter(([key, value]) => value && PARTIALS_MAP[key])
    .map(([key]) => PARTIALS_MAP[key]);

  const client = new ClientClass({
    intents: resolvedIntents,
    partials: resolvedPartials,
    ...clientOptions
  });
  const appLog = typeof log.child === 'function' ? log.child({ component: 'discord', clientId: resolvedClientId }) : log;
  let signalRegistration;
  let processHandlerRegistration;
  let cleanupEvents = () => {};
  const cleanup = () => shutdownDiscord(client, { cleanupEvents, signalRegistration, processHandlerRegistration });
  client.shutdown = cleanup;

  try {
    if (signals) {
      signalRegistration = registerSignals({ ...signalOptions, log: appLog, exit: false, shutdownHook: async (signal) => {
        await cleanup();
        await signalOptions.shutdownHook?.(signal);
      } });
    }
    if (processHandlers) {
      processHandlerRegistration = registerHandlers({ ...processHandlerOptions, log: appLog });
    }

    const localeResult = await setupLocalesFn({ localesDir, log: appLog });
    if (!localeResult || typeof localeResult.msg !== 'function' || !Array.isArray(localeResult.loadedLocales)) {
      throw new TypeError('setupLocalesFn must return { msg, loadedLocales }.');
    }
    const { msg, loadedLocales } = localeResult;

    const commandResult = await setupCommandsFn({ commandsDir, log: appLog });
    if (!commandResult ||
        (commandResult.commandDefs !== undefined && !Array.isArray(commandResult.commandDefs)) ||
        !commandResult.commandHandlers || typeof commandResult.commandHandlers !== 'object') {
      throw new TypeError('setupCommandsFn must return { commandDefs, commandHandlers }.');
    }
    const commandDefs = commandResult.commandDefs ?? [];
    const { commandHandlers } = commandResult;

    const eventResult = await setupEventsFn({ client, eventsDir, log: appLog, msg, commandHandlers, context });
    if (!eventResult || !Array.isArray(eventResult.loadedEvents)) {
      throw new TypeError('setupEventsFn must return { loadedEvents, cleanup }.');
    }
    const { loadedEvents } = eventResult;
    cleanupEvents = typeof eventResult.cleanup === 'function' ? eventResult.cleanup : () => {};

    if (commandDefs.length > 0) {
      const registerSuccess = await registerCommandsFn({ commandDefs, clientId: resolvedClientId, token, log: appLog });
      if (!registerSuccess) {
        throw new Error('Failed to register commands with Discord API. Please check your command definitions and token.');
      }
    } else {
      appLog.warn('No commands to register.');
    }
    appLog.info('Discord app initialized', {
      eventCount: loadedEvents.length,
      localeCount: loadedLocales.length,
      commandCount: commandDefs.length,
    });

    try {
      await client.login(token);
    } catch (error) {
      throw new Error(`Failed to log in to Discord: ${error.message}`, { cause: error });
    }
    return client;
  } catch (error) {
    await cleanup();
    throw error;
  }
};

/** Cleanly removes loaded handlers, clears locales, and destroys a Discord client. */
export const shutdownDiscord = async (client, { cleanupEvents = () => {}, clearLocalesFn = clearLocales, signalRegistration, processHandlerRegistration } = {}) => {
  if (!client || shutdownClients.has(client)) return;
  shutdownClients.add(client);
  try {
    cleanupEvents();
  } finally {
    try {
      clearLocalesFn();
    } finally {
      signalRegistration?.removeHandlers?.();
      processHandlerRegistration?.removeHandlers?.();
      if (typeof client.destroy === 'function') await client.destroy();
    }
  }
};

/**
 * Splits a message into chunks of up to maxLength characters, attempting to split at newlines or periods for readability.
 *
 * @param {string} msg - The message to split
 * @param {number} [maxLength=2000] - The maximum length of each chunk (default: 2000)
 * @returns {string[]} An array of message chunks, each no longer than maxLength
 */
export function splitMsg(msg, maxLength = 2000) {
    if (typeof msg !== 'string') {
        throw new TypeError('msg must be a string.');
    }
    if (!Number.isFinite(maxLength) || maxLength < 1) {
        throw new RangeError('maxLength must be a positive finite number.');
    }
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
    chunks.push(msg);
    return chunks;
}