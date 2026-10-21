import { log as logger } from "@eliware/log";
import { path } from "@eliware/path";
import { loadLocales } from "./loader.mjs";

export const setupLocaleStore = ({
  localesDir = path(import.meta, "..", "..", "locales"),
  log = logger,
  fsLib,
  msg,
  locales: localeMaps,
  loadLocalesFn = loadLocales,
  clearLocalesFn,
}) => {
  clearLocalesFn();
  const loaded = loadLocalesFn({ localesDir, log, fsLib });
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
