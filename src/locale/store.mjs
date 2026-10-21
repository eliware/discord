export const createLocaleStore = () => {
  /** Store loaded locale maps. @type {Object.<string, Object.<string, string>>} */
  const locales = {};
  const clearLocales = () => Object.keys(locales).forEach((key) => delete locales[key]);
  return { locales, clearLocales };
};

export const storeLocaleDefinitions = ({ locales, loaded }) => {
  for (const [name, locale] of loaded) {
    Object.defineProperty(locales, name, {
      value: locale,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  }
};
