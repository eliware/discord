import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { readdirSync, readFileSync } from "fs";

/** Find locale JSON files and read their contents. */
export const readLocaleFiles = ({
  localesDir = path(import.meta, "..", "..", "locales"),
  fsLib = { readdirSync, readFileSync },
  log = logger,
} = {}) => {
  let files;
  try {
    if (fsLib.existsSync && !fsLib.existsSync(localesDir)) return [];
    files = fsLib.readdirSync(localesDir).filter((file) => file.endsWith(".json"));
  } catch {
    return [];
  }
  return files
    .map((file) => {
      try {
        return { file, content: fsLib.readFileSync(path(localesDir, file), "utf8") };
      } catch (error) {
        log.error(`Failed to load or parse locale file ${file}:`, error);
        return undefined;
      }
    })
    .filter(Boolean);
};
