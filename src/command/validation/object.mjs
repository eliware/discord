export const validateCommandObject = (definition) => {
  if (!definition || typeof definition !== "object" || Array.isArray(definition)) {
    return "definition must be an object";
  }
  return null;
};
