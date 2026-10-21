import { log as logger } from "@eliware/log";
import { createCommandDependencies } from "./dependencies.mjs";
import { discoverCommandFiles } from "./discovery.mjs";
import { createCommandCollection } from "./collection.mjs";

export const setupCommands = async ({ commandsDir, log = logger, fsLib, importFn } = {}) => {
  const { fsLib: commandFs, importFn: commandImport } = createCommandDependencies({
    fsLib,
    importFn,
  });
  const files = discoverCommandFiles({ commandsDir, fsLib: commandFs, log });
  return createCommandCollection({
    files,
    commandsDir,
    fsLib: commandFs,
    importFn: commandImport,
    log,
  });
};
