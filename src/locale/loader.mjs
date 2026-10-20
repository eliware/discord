import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { discoverLocaleFiles } from "./discovery.mjs";
import { readLocaleFiles } from "./file-reader.mjs";
import { loadLocaleDefinitions } from "./definition-loader.mjs";

/**
 * Parse and validate locale file contents.
 * @param {Object} options Locale folder, file methods, and logger.
 * @returns {Array<[string, Object.<string, string>]>} Valid locale names and maps.
 */
export const loadLocales = ({
  localesDir = path(import.meta, "..", "..", "locales"),
  log = logger,
  fsLib,
  discoverFiles = discoverLocaleFiles,
  readFiles = readLocaleFiles,
} = {}) => {
  return loadLocaleDefinitions({
    files: readFiles({ files: discoverFiles({ localesDir, fsLib }), localesDir, fsLib, log }),
    log,
  });
};
