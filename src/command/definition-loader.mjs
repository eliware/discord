import { path } from "@eliware/path";
import { validateCommandDefinition } from "./validation.mjs";

/** Parse and validate command definition files in order. */
export function* loadCommandDefinitions({ files, commandsDir, fsLib, log }) {
  for (const file of files) {
    try {
      const definition = JSON.parse(fsLib.readFileSync(path(commandsDir, file), "utf8"));
      const name = file.replace(/\.json$/, "");
      const validationError = validateCommandDefinition(definition);
      if (validationError || definition.name !== name) {
        log.error(
          `Invalid command definition for ${file}: ${validationError ?? "name must match file name"}`,
        );
        continue;
      }
      yield { name, definition };
    } catch (error) {
      log.error(`Failed to load command definition for ${file}:`, error);
    }
  }
}
