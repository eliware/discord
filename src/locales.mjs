import { createLocaleLookup } from "./locale/lookup.mjs";
import { setupLocaleStore } from "./locale/setup.mjs";
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
export const setupLocales = (options = {}) => setupLocaleStore({ ...options, msg });
