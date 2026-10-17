import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { validateLocale } from "./locale-validation.mjs";
import { readdirSync, readFileSync } from "fs";

/** Store loaded locale maps. @type {Object.<string, Object.<string, string>>} */
export const locales = {};

const hasOwn = (value, key) => Object.hasOwn(value, key);

/**
 * Return the message for a locale and key.
 * @param {string} locale Locale name, such as `en-US`
 * @param {string} key Message key
 * @param {string} [defaultValue='An important error occurred.'] Text for a missing key
 * @returns {string} Message text or the supplied text
 */
export const msg = (locale, key, defaultValue = "An important error occurred.", log = logger) => {
  if (!hasOwn(locales, locale) || !locales[locale]) {
    log.warn(`Locale "${locale}" does not exist. Use the default locale.`);
    locale = "en-US";
  }
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
