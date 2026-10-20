/** Store loaded locale maps. @type {Object.<string, Object.<string, string>>} */
export const locales = {};

/** Remove all loaded locales from memory. */
export const clearLocales = () => {
  Object.keys(locales).forEach((key) => delete locales[key]);
};
