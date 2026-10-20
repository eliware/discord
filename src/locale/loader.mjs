import { log as logger } from "@eliware/log";
import { readLocaleFiles } from "./files.mjs";
import { loadLocaleDefinitions } from "./definition-loader.mjs";

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
  return loadLocaleDefinitions({ files: readFiles({ localesDir, fsLib, log }), log });
};
