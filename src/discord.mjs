import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { createDiscordClient } from "./client/create.mjs";
import { createClientLocaleStore } from "./client/locale-store.mjs";
import { initializeDiscord } from "./initialize.mjs";
import { shutdownDiscord } from "./shutdown.mjs";
import { validateContext } from "./context-validation.mjs";
import { registerOptionalHandlers } from "./handler-registration.mjs";
import { loginDiscordClient } from "./client/login.mjs";
import { createClientLogger } from "./client/logger.mjs";

export const createDiscord = async ({
  clientId,
  token = process.env.DISCORD_TOKEN,
  log = logger,
  rootDir = process.cwd(),
  localesDir = path(rootDir, "locales"),
  commandsDir = path(rootDir, "commands"),
  eventsDir = path(rootDir, "events"),
  intents,
  partials,
  context = {},
  clientOptions = {},
  enabled = true,
  signals = false,
  signalOptions = {},
  processHandlers = false,
  processHandlerOptions = {},
} = {}) => {
  if (enabled === false) return null;
  const resolvedClientId = clientId ?? process.env.DISCORD_CLIENT_ID;
  if (!resolvedClientId)
    throw new Error("DISCORD_CLIENT_ID is not set. Please check your .env file.");
  if (!token) throw new Error("DISCORD_TOKEN is not set. Please check your .env file.");
  validateContext(context);

  const localeStore = createClientLocaleStore();
  const client = createDiscordClient({ intents, partials, clientOptions });
  const appLog = createClientLogger(log, resolvedClientId);
  const registrations = {};
  let cleanupEvents = () => {};
  const cleanup = () =>
    shutdownDiscord(client, {
      cleanupEvents,
      clearLocalesFn: localeStore.clearLocales,
      registrations,
    });
  client.shutdown = cleanup;

  try {
    registerOptionalHandlers({
      signals,
      signalOptions,
      processHandlers,
      processHandlerOptions,
      log: appLog,
      cleanup,
      registrations,
    });
    cleanupEvents = await initializeDiscord({
      client,
      clientId: resolvedClientId,
      token,
      localesDir,
      commandsDir,
      eventsDir,
      log: appLog,
      context,
      setupLocalesFn: localeStore.setupLocales,
    });
    await loginDiscordClient(client, token);
    return client;
  } catch (error) {
    await cleanup();
    throw error;
  }
};
