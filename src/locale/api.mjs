import { createLocaleLookup } from "./lookup.mjs";
import { clearLocales, locales } from "./store.mjs";

export { clearLocales, locales };

/** Return a message for a locale and key. */
export const msg = createLocaleLookup(locales);
