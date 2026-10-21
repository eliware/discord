import { loadCommandDefinitions } from "./definition-loader.mjs";
import { loadCommandHandler } from "./handler-loader.mjs";

export const createCommandCollection = async ({ files, commandsDir, fsLib, importFn, log }) => {
  const commandHandlers = {};
  const commandDefs = [];
  for (const { name, definition } of loadCommandDefinitions({
    files,
    commandsDir,
    fsLib,
    log,
  })) {
    const handler = await loadCommandHandler({ name, commandsDir, fsLib, importFn, log });
    if (!handler) continue;
    commandDefs.push(definition);
    commandHandlers[name] = handler;
  }
  return { commandDefs, commandHandlers };
};
