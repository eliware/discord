import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { readFileSync } from "fs";

export const readLocaleFiles = ({ files, localesDir, fsLib = { readFileSync }, log = logger }) =>
  files
    .map((file) => {
      try {
        return { file, content: fsLib.readFileSync(path(localesDir, file), "utf8") };
      } catch (error) {
        log.error(`Failed to load or parse locale file ${file}:`, error);
        return undefined;
      }
    })
    .filter(Boolean);
