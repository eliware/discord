import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { validateLocale } from "./locale-validation.mjs";
import { createLocaleLookup } from "./locale/lookup.mjs";
import { readdirSync, readFileSync } from "fs";

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
  fsLib = { readdirSync, readFileSync },
} = {}) => {
  Object.keys(locales).forEach((key) => delete locales[key]);
  let loadedLocales = [];
  let files = [];
  try {
    if (fsLib.existsSync && !fsLib.existsSync(localesDir)) {
      return { msg, loadedLocales };
    }
    files = fsLib.readdirSync(localesDir).filter((f) => f.endsWith(".json"));
  } catch {
    return { msg, loadedLocales };
  }
  for (const file of files) {
    try {
      const content = fsLib.readFileSync(path(localesDir, file), "utf8");
      const locale = JSON.parse(content);
      if (!validateLocale(locale)) {
        throw new TypeError("locale must be a flat object containing only string values");
      }
      Object.defineProperty(locales, file.replace(/\.json$/, ""), {
        value: locale,
        configurable: true,
        enumerable: true,
        writable: true,
      });
    } catch (_err) {
      log.error(`Failed to load or parse locale file ${file}:`, _err);
    }
  }
  loadedLocales = Object.keys(locales);
  return { msg, loadedLocales };
};

/**
 * Remove all loaded locales from memory.
 * @returns {void}
 */
export const clearLocales = () => {
  Object.keys(locales).forEach((key) => delete locales[key]);
};
