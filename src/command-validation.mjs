export const validateCommandDefinition = (definition) => {
  if (!definition || typeof definition !== "object" || Array.isArray(definition)) {
    return "definition must be an object";
  }
  if (
    typeof definition.name !== "string" ||
    definition.name.length < 1 ||
    definition.name.length > 32
  ) {
    return "name must be 1-32 characters";
  }
  if (
    typeof definition.description !== "string" ||
    definition.description.length < 1 ||
    definition.description.length > 100
  ) {
    return "description must be 1-100 characters";
  }
  return null;
};
