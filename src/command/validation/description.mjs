export const validateCommandDescription = (description) => {
  if (typeof description !== "string" || description.length < 1 || description.length > 100) {
    return "description must be 1-100 characters";
  }
  return null;
};
