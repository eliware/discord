import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { readFileSync } from "fs";
import { reportLocaleFileFailure } from "./failure-reporting.mjs";

export const readLocaleFiles = ({ files, localesDir, fsLib = { readFileSync }, log = logger }) =>
  files
    .map((file) => {
      try {
        return { file, content: fsLib.readFileSync(path(localesDir, file), "utf8") };
      } catch (error) {
        reportLocaleFileFailure({ file, error, log });
        return undefined;
      }
    })
    .filter(Boolean);
