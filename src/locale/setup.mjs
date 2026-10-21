import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { discoverLocaleFiles } from "./discovery.mjs";
import { readLocaleFiles } from "./file-reader.mjs";
import { loadLocaleDefinitions } from "./definition-loader.mjs";
import { storeLocaleDefinitions } from "./store.mjs";

export const setupLocaleStore = ({
  localesDir = path(import.meta, "..", "..", "locales"),
  log = logger,
  fsLib,
  msg,
  locales: localeMaps,
  discoverFiles = discoverLocaleFiles,
  readFiles = readLocaleFiles,
  loadDefinitions = loadLocaleDefinitions,
  storeDefinitions = storeLocaleDefinitions,
  clearLocalesFn,
}) => {
  clearLocalesFn();
  const files = discoverFiles({ localesDir, fsLib });
  const contents = readFiles({ files, localesDir, fsLib, log });
  const loaded = loadDefinitions({ files: contents, log });
  storeDefinitions({ locales: localeMaps, loaded });
  return { msg, loadedLocales: Object.keys(localeMaps) };
};
