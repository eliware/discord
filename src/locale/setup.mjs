import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { discoverLocaleFiles } from "./discovery.mjs";
import { readLocaleFiles } from "./file-reader.mjs";
import { loadLocaleDefinitions } from "./definition-loader.mjs";

export const setupLocaleStore = ({
  localesDir = path(import.meta, "..", "..", "locales"),
  log = logger,
  fsLib,
  msg,
  locales: localeMaps,
  discoverFiles = discoverLocaleFiles,
  readFiles = readLocaleFiles,
  loadDefinitions = loadLocaleDefinitions,
  clearLocalesFn,
}) => {
  clearLocalesFn();
  const files = discoverFiles({ localesDir, fsLib });
  const contents = readFiles({ files, localesDir, fsLib, log });
  const loaded = loadDefinitions({ files: contents, log });
  for (const [name, locale] of loaded) {
    Object.defineProperty(localeMaps, name, {
      value: locale,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  }
  return { msg, loadedLocales: Object.keys(localeMaps) };
};
