import { log as logger } from "@eliware/log";
import { path, pathUrl } from "@eliware/path";
import { existsSync, readFileSync, readdirSync } from "fs";
import { validateCommandDefinition } from "./command-validation.mjs";

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
  for (const file of files) {
    try {
      const definition = JSON.parse(fsLib.readFileSync(path(commandsDir, file), "utf8"));
      const validationError = validateCommandDefinition(definition);
      if (validationError) {
        log.error(`Invalid command definition for ${file}: ${validationError}`);
        continue;
      }
      const name = file.replace(/\.json$/, "");
      const handlerPath = path(commandsDir, `${name}.mjs`);
      if (!fsLib.existsSync(handlerPath)) {
        log.warn(`No handler found for command ${name}`);
        continue;
      }
      try {
        const module = await importFn(pathUrl(handlerPath));
        if (typeof module.default !== "function") {
          log.warn(`Handler for ${name} does not export a default function.`);
          continue;
        }
        commandDefs.push(definition);
        commandHandlers[name] = module.default;
      } catch (error) {
        log.warn(`Failed to load handler for ${name}:`, error);
      }
    } catch (error) {
      log.error(`Failed to load command definition for ${file}:`, error);
    }
  }
  return { commandDefs, commandHandlers };
};
