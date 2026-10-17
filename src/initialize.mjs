import { setupEvents } from "./events.mjs";
import { setupCommands } from "./commands.mjs";
import { registerCommands } from "./command/registration.mjs";
import { setupLocales } from "./locales.mjs";

const createEventCleanup = (client) => {
  if (
    typeof client?.eventNames !== "function" ||
    typeof client.listeners !== "function" ||
    (typeof client.off !== "function" && typeof client.removeListener !== "function")
  ) {
    return () => {};
  }
  const existing = new Map(client.eventNames().map((name) => [name, client.listeners(name)]));
  return () => {
    for (const name of client.eventNames()) {
      for (const listener of client.listeners(name)) {
        if (existing.get(name)?.includes(listener)) continue;
        if (typeof client.off === "function") client.off(name, listener);
        else client.removeListener(name, listener);
      }
    }
  };
};

export const initializeDiscord = async ({
  client,
  clientId,
  token,
  localesDir,
  commandsDir,
  eventsDir,
  log,
  context,
  setupLocalesFn = setupLocales,
  setupCommandsFn = setupCommands,
  setupEventsFn = setupEvents,
  registerCommandsFn = registerCommands,
}) => {
  const localeResult = await setupLocalesFn({ localesDir, log });
  if (
    !localeResult ||
    typeof localeResult.msg !== "function" ||
    !Array.isArray(localeResult.loadedLocales)
  ) {
    throw new TypeError("setupLocalesFn must return { msg, loadedLocales }.");
  }
  const commandResult = await setupCommandsFn({ commandsDir, log });
  if (
    !commandResult ||
    (commandResult.commandDefs !== undefined && !Array.isArray(commandResult.commandDefs)) ||
    !commandResult.commandHandlers ||
    typeof commandResult.commandHandlers !== "object"
  ) {
    throw new TypeError("setupCommandsFn must return { commandDefs, commandHandlers }.");
  }
  const commandDefs = commandResult.commandDefs ?? [];
  const fallbackCleanup = createEventCleanup(client);
  let eventResult;
  try {
    eventResult = await setupEventsFn({
      client,
      eventsDir,
      log,
      msg: localeResult.msg,
      commandHandlers: commandResult.commandHandlers,
      context,
    });
  } catch (error) {
    fallbackCleanup();
    throw error;
  }
  const cleanupEvents =
    typeof eventResult?.cleanup === "function" ? eventResult.cleanup : fallbackCleanup;
  try {
    if (!eventResult || !Array.isArray(eventResult.loadedEvents)) {
      throw new TypeError("setupEventsFn must return { loadedEvents, cleanup }.");
    }
    if (commandDefs.length > 0) {
      const success = await registerCommandsFn({ commandDefs, clientId, token, log });
      if (!success)
        throw new Error(
          "Discord did not accept the commands. Check the command definitions and token.",
        );
    } else {
      log.warn("No commands are available to send.");
    }
    log.info("Discord app initialized", {
      eventCount: eventResult.loadedEvents.length,
      localeCount: localeResult.loadedLocales.length,
      commandCount: commandDefs.length,
    });
    return cleanupEvents;
  } catch (error) {
    cleanupEvents();
    throw error;
  }
};
