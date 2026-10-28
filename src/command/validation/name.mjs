const commandNamePattern = /^[-_\u02BC\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u;

export const validateCommandName = (name) => {
  if (typeof name !== "string" || !commandNamePattern.test(name) || name !== name.toLowerCase()) {
    return "name must use 1-32 valid Discord command characters";
  }
  return null;
};
