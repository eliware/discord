import { log as logger } from "@eliware/log";
import { cleanupEventListeners } from "./event/listener-cleanup.mjs";
import { discoverEventHandlers } from "./event/discovery.mjs";
import { createDefaultEventErrorHandler, createDefaultEventMessage } from "./event/defaults.mjs";
import { attachEventHandler } from "./event/attachment.mjs";

/**
 * Load event handlers from a folder and attach them to a client.
 * @param {Object} options Setup values include the client, folder, message function, handlers, file methods, and module loader.
 * @returns {Promise<{ loadedEvents: string[] }>} Loaded event names and cleanup function.
 */
export const setupEvents = async ({
  client,
  eventsDir,
  log = logger,
  msg = createDefaultEventMessage(log),
  commandHandlers = {},
  context = {},
  onHandlerError = createDefaultEventErrorHandler(log),
  fsLib,
  importFn,
} = {}) => {
  const loadedEvents = [];
  const listeners = [];
  const cleanup = () => cleanupEventListeners(client, listeners);
  try {
    const discovered = await discoverEventHandlers({
      eventsDir,
      log,
      fsLib,
      importFn,
      onHandler: (eventName, handler) =>
        attachEventHandler({
          client,
          context,
          log,
          msg,
          eventName,
          commandHandlers,
          handler,
          onHandlerError,
          listeners,
          loadedEvents,
        }),
    });
    if (!discovered) return { loadedEvents: [] };
  } catch (error) {
    try {
      cleanup();
    } catch (cleanupError) {
      log.error("Failed to clean up event listeners:", cleanupError);
    }
    throw error;
  }
  return { loadedEvents, cleanup };
};
