import { log as logger } from "@eliware/log";
import { existsSync, readFileSync, readdirSync } from "fs";
import { loadCommandDefinitions } from "./command/definition-loader.mjs";
import { loadCommandHandler } from "./command/handler-loader.mjs";

export const setupCommands = async ({
  commandsDir,
  log = logger,
  fsLib = { readdirSync, readFileSync, existsSync },
  importFn = (url) => import(url),
} = {}) => {
  let files;
  try {
    if (fsLib.existsSync && !fsLib.existsSync(commandsDir)) {
      log.warn(`Commands directory does not exist: ${commandsDir}`);
      return { commandDefs: [], commandHandlers: {} };
    }
    files = fsLib.readdirSync(commandsDir).filter((file) => file.endsWith(".json"));
  } catch {
    log.warn(`Commands directory missing or unreadable: ${commandsDir}`);
    return { commandDefs: [], commandHandlers: {} };
  }

  const commandHandlers = {};
  const commandDefs = [];
  for (const { name, definition } of loadCommandDefinitions({ files, commandsDir, fsLib, log })) {
    const handler = await loadCommandHandler({ name, commandsDir, fsLib, importFn, log });
    if (!handler) continue;
    commandDefs.push(definition);
    commandHandlers[name] = handler;
  }
  return { commandDefs, commandHandlers };
};
