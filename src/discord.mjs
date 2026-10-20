import { registerHandlers } from "@eliware/errors";
import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { registerSignals } from "@eliware/signals";
import { Client } from "discord.js";
import { createClientOptions } from "./client-options.mjs";
import { initializeDiscord } from "./initialize.mjs";
import { shutdownDiscord } from "./shutdown.mjs";
import { validateContext } from "./context-validation.mjs";
import { createSignalCleanupHook } from "./signal-cleanup.mjs";

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

  const client = new Client(createClientOptions(intents, partials, clientOptions));
  const appLog = log.child({ component: "discord", clientId: resolvedClientId });
  let signalRegistration;
  let processHandlerRegistration;
  let cleanupEvents = () => {};
  const cleanup = () =>
    shutdownDiscord(client, { cleanupEvents, signalRegistration, processHandlerRegistration });
  client.shutdown = cleanup;

  try {
    if (signals) {
      signalRegistration = registerSignals({
        ...signalOptions,
        log: appLog,
        exit: false,
        shutdownHook: createSignalCleanupHook(cleanup, signalOptions.shutdownHook),
      });
    }
    if (processHandlers)
      processHandlerRegistration = registerHandlers({ ...processHandlerOptions, log: appLog });
    cleanupEvents = await initializeDiscord({
      client,
      clientId: resolvedClientId,
      token,
      localesDir,
      commandsDir,
      eventsDir,
      log: appLog,
      context,
    });
    try {
      await client.login(token);
    } catch (error) {
      throw new Error(`Discord sign-in failed: ${error.message}`, { cause: error });
    }
    return client;
  } catch (error) {
    await cleanup();
    throw error;
  }
};
