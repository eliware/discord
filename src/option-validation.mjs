import { isPlainObject } from "./object-validation.mjs";

/** Validate a string-keyed boolean option map. */
export const validateBooleanMap = (value, allowedKeys, optionName) => {
  if (value === undefined || Array.isArray(value)) return;
  if (!isPlainObject(value)) {
    throw new TypeError(`${optionName} must be an object of boolean values.`);
  }
  for (const [key, enabled] of Object.entries(value)) {
    if (!allowedKeys.has(key)) throw new RangeError(`Unknown ${optionName} key: ${key}`);
    if (typeof enabled !== "boolean") {
      throw new TypeError(`${optionName}.${key} must be a boolean.`);
    }
  }
};
