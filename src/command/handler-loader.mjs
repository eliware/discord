import { path, pathUrl } from "@eliware/path";

/** Import a command handler when its file exists and exports a function. */
export const loadCommandHandler = async ({ name, commandsDir, fsLib, importFn, log }) => {
  const handlerPath = path(commandsDir, `${name}.mjs`);
  try {
    if (fsLib.existsSync && !fsLib.existsSync(handlerPath)) {
      log.warn(`No handler found for command ${name}`);
      return undefined;
    }
    const module = await importFn(pathUrl(handlerPath));
    if (typeof module.default !== "function") {
      log.warn(`Handler for ${name} does not export a default function.`);
      return undefined;
    }
    return module.default;
  } catch (error) {
    log.warn(`Failed to load handler for ${name}:`, error);
    return undefined;
  }
};
