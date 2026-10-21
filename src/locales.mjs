import { setupLocaleStore } from "./locale/setup.mjs";
import { msg } from "./locale/lookup-api.mjs";

export { clearLocales, locales } from "./locale/api.mjs";
export { msg } from "./locale/lookup-api.mjs";

/**
 * Load locale JSON files from a folder.
 * @param {Object} [options] Locale setup options.
 * @param {string} [options.localesDir] Locale folder path.

 * @param {Object} [options.fsLib] File methods for tests.
 * @returns {{ msg: typeof msg, loadedLocales: string[] }} Message function and locale names.
 */
export const setupLocales = (options = {}) => setupLocaleStore({ ...options, msg });
