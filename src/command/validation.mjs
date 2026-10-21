import { validateCommandObject } from "./validation/object.mjs";
import { validateCommandName } from "./validation/name.mjs";
import { validateCommandDescription } from "./validation/description.mjs";

export const validateCommandDefinition = (definition) => {
  const objectError = validateCommandObject(definition);
  if (objectError) return objectError;
  return validateCommandName(definition.name) ?? validateCommandDescription(definition.description);
};
