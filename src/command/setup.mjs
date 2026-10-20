import { log as logger } from "@eliware/log";
import { createCommandDependencies } from "./dependencies.mjs";
import { loadCommandDefinitions } from "./definition-loader.mjs";
import { loadCommandHandler } from "./handler-loader.mjs";
import { discoverCommandFiles } from "./discovery.mjs";

export const setupCommands = async ({ commandsDir, log = logger, fsLib, importFn } = {}) => {
  const dependencies = createCommandDependencies({ fsLib, importFn });
  fsLib = dependencies.fsLib;
  importFn = dependencies.importFn;
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
