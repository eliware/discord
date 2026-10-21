export const createLocaleStore = () => {
  /** Store loaded locale maps. @type {Object.<string, Object.<string, string>>} */
  const locales = {};
  const clearLocales = () => Object.keys(locales).forEach((key) => delete locales[key]);
  return { locales, clearLocales };
};
