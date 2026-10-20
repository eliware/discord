import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { validateLocale } from "../locale-validation.mjs";
import { readdirSync, readFileSync } from "fs";

/**
 * Read and validate locale files from a folder.
 * @param {Object} options Locale folder, file methods, and logger.
 * @returns {Array<[string, Object.<string, string>]>} Valid locale names and maps.
 */
export const loadLocales = ({
  localesDir = path(import.meta, "..", "..", "locales"),
  log = logger,
  fsLib = { readdirSync, readFileSync },
} = {}) => {
  let files = [];
  try {
    if (fsLib.existsSync && !fsLib.existsSync(localesDir)) return [];
    files = fsLib.readdirSync(localesDir).filter((file) => file.endsWith(".json"));
  } catch {
    return [];
  }
  const loaded = [];
  for (const file of files) {
    try {
      const content = fsLib.readFileSync(path(localesDir, file), "utf8");
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
