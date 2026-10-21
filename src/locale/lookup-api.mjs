import { createLocaleLookup } from "./lookup.mjs";
import { locales } from "./api.mjs";

/** Return a message for a locale and key. */
export const msg = createLocaleLookup(locales);
