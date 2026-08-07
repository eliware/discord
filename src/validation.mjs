/** Validate a plain object. */
export const isPlainObject = (value) => {
  if (value === null || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

/** Validate a string-keyed boolean option map. */
export const validateBooleanMap = (value, allowedKeys, optionName) => {
  if (value === undefined || Array.isArray(value)) return;
  if (!isPlainObject(value)) {
    throw new TypeError(`${optionName} must be an object of boolean values.`);
  }
  for (const [key, enabled] of Object.entries(value)) {
    if (!allowedKeys.has(key)) throw new RangeError(`Unknown ${optionName} key: ${key}`);
    if (typeof enabled !== 'boolean') {
      throw new TypeError(`${optionName}.${key} must be a boolean.`);
    }
  }
};

/** Validate application context and reserve framework-owned fields. */
export const validateContext = (value, reservedKeys = new Set(['client', 'log', 'msg', 'commandHandlers'])) => {
  if (!isPlainObject(value)) throw new TypeError('context must be a plain object.');
  for (const key of reservedKeys) {
    if (Object.hasOwn(value, key)) throw new RangeError(`context cannot define reserved key: ${key}`);
  }
};

/** Validate a locale payload as a flat string map. */
export const validateLocale = (value) => {
  if (!isPlainObject(value)) return false;
  return Object.values(value).every((message) => typeof message === 'string');
};
