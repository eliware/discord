import { clearLocales, locales, msg } from "./api.mjs";
import { setupLocaleStore } from "./setup.mjs";

/**
 * Load locale JSON files from a folder.
 * @param {Object} [options] Locale setup options.
 * @param {string} [options.localesDir] Locale folder path.
 * @param {Object} [options.fsLib] File methods for tests.
 * @returns {{ msg: typeof msg, loadedLocales: string[] }} Message function and locale names.
 */
export const setupLocales = (options = {}) =>
  setupLocaleStore({ ...options, clearLocalesFn: clearLocales, locales, msg });
