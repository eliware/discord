import { log as logger } from "@eliware/log";
import { pathUrl } from "@eliware/path";
import { readdirSync } from "fs";
import { createEventListener } from "./event-listener.mjs";

/**
 * Load event handlers from a folder and attach them to a client.
 * @param {Object} options Setup values include the client, folder, message function, handlers, file methods, and module loader.
 * @returns {Promise<{ loadedEvents: string[] }>} Loaded event names and cleanup function.
 */
export const setupEvents = async ({
  client,
  eventsDir,
  log = logger,
  msg = (locale, key, defaultMsg) => {
    log.warn(`Localization function not provided. Returning default message for ${key}.`);
    return defaultMsg || "An error occurred.";
  },
  commandHandlers = {},
  context = {},
  onHandlerError = (error, eventName) => log.error(`Event handler failed for ${eventName}:`, error),
  fsLib = { readdirSync },
  importFn = (p) => import(p),
} = {}) => {
  let files = [];
  try {
    files = fsLib.readdirSync(eventsDir).filter((f) => f.endsWith(".mjs"));
  } catch {
    log.warn(`Events directory missing or unreadable: ${eventsDir}`);
    return { loadedEvents: [] };
  }
  const loadedEvents = [];
  const listeners = [];
  const cleanup = () => {
    let cleanupError;
    for (const [eventName, listener] of listeners) {
      try {
        if (typeof client.off === "function") client.off(eventName, listener);
        else if (typeof client.removeListener === "function")
          client.removeListener(eventName, listener);
      } catch (error) {
        cleanupError ??= error;
      }
    }
    listeners.length = 0;
    if (cleanupError) throw cleanupError;
  };
  try {
    for (const file of files) {
      const eventName = file.replace(/\.mjs$/, "");
      try {
        const handler = await importFn(pathUrl(eventsDir, file));
        if (!client) throw new Error("Discord client is undefined");
        if (typeof handler?.default !== "function") {
          log.warn(`Event handler for ${eventName} does not export a default function.`);
          continue;
        }
        const listener = createEventListener({
          client,
          context,
          log,
          msg,
          eventName,
          commandHandlers,
          handler: handler.default,
          onHandlerError,
        });
        listeners.push([eventName, listener]);
        try {
          client.on(eventName, listener);
        } catch (error) {
          error.eventListenerAttach = true;
          throw error;
        }
        loadedEvents.push(eventName);
      } catch (err) {
        if (err?.eventListenerAttach) throw err;
        log.error(`Failed to load event ${eventName}:`, err);
      }
    }
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
