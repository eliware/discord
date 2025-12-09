import logger from '@eliware/log';
import { path } from '@eliware/path';
import { readdirSync, readFileSync } from 'fs';

/**
 * In-memory object containing all loaded locales.
 * @type {Object.<string, Object.<string, string>>}
 */
export const locales = {};

/**
 * Retrieves a localized message for a given locale and key.
 * @param {string} locale - The locale code (e.g., 'en-US')
 * @param {string} key - The message key
 * @param {string} [defaultValue='A serious error occurred.'] - Default value if not found
 * @param {import('@eliware/log').Logger} [log=logger] - Logger instance
 * @returns {string} The localized message or default value
 */
export const msg = (locale, key, defaultValue = 'A serious error occurred.', log = logger) => {
    if (!locales[locale]) {
        log.warn(`Locale "${locale}" not found, falling back to default.`);
        locale = 'en-US';
    }
    if (!locales[locale]) {
        log.error(`Default locale "en-US" not found. Returning default value.`);
        return defaultValue;
    }
    const message = locales[locale][key];
    if (message === undefined) {
        log.warn(`Key "${key}" not found in locale "${locale}", returning default value.`);
        return defaultValue;
    }
    return message;
};

/**
 * Loads all locale files from the specified directory into memory.
 * @param {Object} [options] - Options for loading locales
 * @param {string} [options.localesDir] - Directory path for locale files
 * @param {import('@eliware/log').Logger} [options.log] - Logger instance
 * @param {Object} [options.fsLib] - File system library (for testing)
 * @returns {{ msg: typeof msg, loadedLocales: string[] }} Object with msg function and loadedLocales array
 */
export const setupLocales = ({
    localesDir = path(import.meta, '..', 'locales'),
    log = logger,
    fsLib = { readdirSync, readFileSync },
} = {}) => {
    let loadedLocales = [];
    try {
        let files = [];
        try {
            // Check if directory exists before reading
            if (fsLib.existsSync && !fsLib.existsSync(localesDir)) {
                //log.warn(`Locales directory does not exist: ${localesDir}`);
                return { msg, loadedLocales };
            }
            files = fsLib.readdirSync(localesDir).filter(f => f.endsWith('.json'));
        } catch (err) {
            //log.warn(`Locales directory missing or unreadable: ${localesDir}`);
            return { msg, loadedLocales };
        }
        for (const file of files) {
            try {
                const content = fsLib.readFileSync(path(localesDir, file), 'utf8');
                locales[file.replace(/\.json$/, '')] = JSON.parse(content);
            } catch (err) {
                log.error(`Failed to load or parse locale file ${file}:`, err);
            }
        }
        loadedLocales = Object.keys(locales);
    } catch (err) {
        log.error('Unexpected error in loadLocales:', err);
    }
    return { msg, loadedLocales };
};

/**
 * Clears all loaded locales from memory.
 * @returns {void}
 */
export const clearLocales = () => {
    Object.keys(locales).forEach(key => delete locales[key]);
};
