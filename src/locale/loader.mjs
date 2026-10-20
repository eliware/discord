import { log as logger } from "@eliware/log";
import { validateLocale } from "../locale-validation.mjs";
import { readLocaleFiles } from "./files.mjs";

/**
 * Parse and validate locale file contents.
 * @param {Object} options Locale folder, file methods, and logger.
 * @returns {Array<[string, Object.<string, string>]>} Valid locale names and maps.
 */
export const loadLocales = ({
  localesDir,
  log = logger,
  fsLib,
  readFiles = readLocaleFiles,
} = {}) => {
  const loaded = [];
  for (const { file, content } of readFiles({ localesDir, fsLib, log })) {
    try {
      const locale = JSON.parse(content);
      if (!validateLocale(locale)) {
        throw new TypeError("locale must be a flat object containing only string values");
      }
      loaded.push([file.replace(/\.json$/, ""), locale]);
    } catch (error) {
      log.error(`Failed to load or parse locale file ${file}:`, error);
    }
  }
  return loaded;
};
