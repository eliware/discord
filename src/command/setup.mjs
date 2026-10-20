import { log as logger } from "@eliware/log";
import { existsSync, readFileSync, readdirSync } from "fs";
import { loadCommandDefinitions } from "./definition-loader.mjs";
import { loadCommandHandler } from "./handler-loader.mjs";
import { discoverCommandFiles } from "./discovery.mjs";

export const setupCommands = async ({
  commandsDir,
  log = logger,
  fsLib = { readdirSync, readFileSync, existsSync },
  importFn = (url) => import(url),
} = {}) => {
  const files = discoverCommandFiles({ commandsDir, fsLib, log });
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
