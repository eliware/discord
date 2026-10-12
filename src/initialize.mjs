import { setupEvents } from "./events.mjs";
import { setupCommands } from "./commands.mjs";
import { registerCommands } from "./command-registration.mjs";
import { setupLocales } from "./locales.mjs";

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
  const eventResult = await setupEventsFn({
    client,
    eventsDir,
    log,
    msg: localeResult.msg,
    commandHandlers: commandResult.commandHandlers,
    context,
  });
  if (!eventResult || !Array.isArray(eventResult.loadedEvents)) {
    throw new TypeError("setupEventsFn must return { loadedEvents, cleanup }.");
  }
  const cleanupEvents = typeof eventResult.cleanup === "function" ? eventResult.cleanup : () => {};
  try {
    if (commandDefs.length > 0) {
      const success = await registerCommandsFn({ commandDefs, clientId, token, log });
      if (!success)
        throw new Error(
          "Failed to register commands with Discord API. Please check your command definitions and token.",
        );
    } else {
      log.warn("No commands to register.");
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
