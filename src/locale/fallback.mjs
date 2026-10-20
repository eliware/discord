export const resolveLocaleFallback = (locales, locale) => {
  if (Object.hasOwn(locales, locale) && locales[locale]) {
    return { locale, usedFallback: false };
  }
  return { locale: "en-US", usedFallback: true };
};
