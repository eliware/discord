import { validateCommandName } from "./validation/name.mjs";
import { validateCommandDescription } from "./validation/description.mjs";

export const validateCommandDefinition = (definition) => {
  if (!definition || typeof definition !== "object" || Array.isArray(definition)) {
    return "definition must be an object";
  }
  return validateCommandName(definition.name) ?? validateCommandDescription(definition.description);
};
