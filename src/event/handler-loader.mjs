import { pathUrl } from "@eliware/path";

/**
 * Import and validate an event handler module.
 * @param {Object} options Event name, folder, loader, and logger.
 * @returns {Promise<Function|undefined>} A valid default handler when one exists.
 */
export const loadEventHandler = async ({ eventName, eventsDir, importFn, log }) => {
  try {
    const module = await importFn(pathUrl(eventsDir, `${eventName}.mjs`));
    if (typeof module?.default !== "function") {
      log.warn(`Event handler for ${eventName} does not export a default function.`);
      return undefined;
    }
    return module.default;
  } catch (error) {
    log.error(`Failed to load event ${eventName}:`, error);
    return undefined;
  }
};
