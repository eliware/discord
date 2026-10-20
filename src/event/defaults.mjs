/** Create the default localization behavior for event handlers. */
export const createDefaultEventMessage = (log) => (locale, key, defaultMsg) => {
  log.warn(`Localization function not provided. Returning default message for ${key}.`);
  return defaultMsg || "An error occurred.";
};

/** Create the default event handler error behavior. */
export const createDefaultEventErrorHandler = (log) => (error, eventName) =>
  log.error(`Event handler failed for ${eventName}:`, error);
