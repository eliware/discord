import { isPlainObject } from "./object-validation.mjs";

/** Validate application context and reserve framework-owned fields. */
export const validateContext = (
  value,
  reservedKeys = new Set(["client", "log", "msg", "commandHandlers"]),
) => {
  if (!isPlainObject(value)) throw new TypeError("context must be a plain object.");
  for (const key of reservedKeys) {
    if (Object.hasOwn(value, key))
      throw new RangeError(`context cannot define reserved key: ${key}`);
  }
};
