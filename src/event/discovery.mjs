import { log as logger } from "@eliware/log";
import { readdirSync } from "fs";
import { loadEventHandler } from "./handler-loader.mjs";

/** Find event files and load valid handlers. */
export const discoverEventHandlers = async ({
  eventsDir,
  log = logger,
  fsLib = { readdirSync },
  importFn = (filePath) => import(filePath),
  onHandler,
} = {}) => {
  let files;
  try {
    files = fsLib.readdirSync(eventsDir).filter((file) => file.endsWith(".mjs"));
  } catch {
    log.warn(`Events directory missing or unreadable: ${eventsDir}`);
    return false;
  }
  for (const file of files) {
    const eventName = file.replace(/\.mjs$/, "");
    const handler = await loadEventHandler({ eventName, eventsDir, importFn, log });
    if (handler) await onHandler(eventName, handler);
  }
  return true;
};
