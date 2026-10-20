import { log as logger } from "@eliware/log";
import { createCommandDependencies } from "./dependencies.mjs";
import { loadCommandDefinitions } from "./definition-loader.mjs";
import { loadCommandHandler } from "./handler-loader.mjs";
import { discoverCommandFiles } from "./discovery.mjs";

export const setupCommands = async ({ commandsDir, log = logger, fsLib, importFn } = {}) => {
  const { fsLib: commandFs, importFn: commandImport } = createCommandDependencies({
    fsLib,
    importFn,
  });
  const files = discoverCommandFiles({ commandsDir, fsLib: commandFs, log });
  const commandHandlers = {};
  const commandDefs = [];
  for (const { name, definition } of loadCommandDefinitions({
    files,
    commandsDir,
    fsLib: commandFs,
    log,
  })) {
    const handler = await loadCommandHandler({
      name,
      commandsDir,
      fsLib: commandFs,
      importFn: commandImport,
      log,
    });
    if (!handler) continue;
    commandDefs.push(definition);
    commandHandlers[name] = handler;
  }
  return { commandDefs, commandHandlers };
};
