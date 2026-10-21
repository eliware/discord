export const validateCommandName = (name) => {
  if (typeof name !== "string" || name.length < 1 || name.length > 32) {
    return "name must be 1-32 characters";
  }
  return null;
};
