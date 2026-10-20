import { log as logger } from "@eliware/log";
import { resolveLocaleFallback } from "./fallback.mjs";

const hasOwn = (value, key) => Object.hasOwn(value, key);

/**
 * Create a message lookup function for a locale map.
 * @param {Object.<string, Object.<string, string>>} locales Locale messages.
 * @returns {Function} A function that returns a locale message or fallback text.
 */
export const createLocaleLookup =
  (locales) =>
  (locale, key, defaultValue = "An important error occurred.", log = logger) => {
    const fallback = resolveLocaleFallback(locales, locale);
    if (fallback.usedFallback) {
      log.warn(`Locale "${locale}" does not exist. Use the default locale.`);
    }
    locale = fallback.locale;
    if (!hasOwn(locales, locale) || !locales[locale]) {
      log.error(`Default locale "en-US" does not exist. Return the supplied text.`);
      return defaultValue;
    }
    const messageMap = locales[locale];
    if (!hasOwn(messageMap, key)) {
      log.warn(`Key "${key}" is missing from locale "${locale}". Return the supplied text.`);
      return defaultValue;
    }
    return messageMap[key];
  };
