import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { createLocaleLookup } from "./locale/lookup.mjs";
import { loadLocales } from "./locale/loader.mjs";
import { clearLocales, locales } from "./locale/store.mjs";

export { clearLocales, locales };

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
  clearLocales();
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
