import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { createLocaleLookup } from "./locale/lookup.mjs";
import { loadLocales } from "./locale/loader.mjs";

/** Store loaded locale maps. @type {Object.<string, Object.<string, string>>} */
export const locales = {};

/** Return a message for a locale and key. */
export const msg = createLocaleLookup(locales);

/**
 * Load locale JSON files from a folder.
 * @param {Object} [options] Locale setup options.
 * @param {string} [options.localesDir] Locale folder path.

 * @param {Object} [options.fsLib] File methods for tests.
 * @returns {{ msg: typeof msg, loadedLocales: string[] }} Message function and locale names.
 */
export const setupLocales = ({
  localesDir = path(import.meta, "..", "locales"),
  log = logger,
  fsLib,
} = {}) => {
  Object.keys(locales).forEach((key) => delete locales[key]);
  const loaded = loadLocales({ localesDir, log, fsLib });
  for (const [name, locale] of loaded) {
    Object.defineProperty(locales, name, {
      value: locale,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  }
  const loadedLocales = Object.keys(locales);
  return { msg, loadedLocales };
};

/**
 * Remove all loaded locales from memory.
 * @returns {void}
 */
export const clearLocales = () => {
  Object.keys(locales).forEach((key) => delete locales[key]);
};
