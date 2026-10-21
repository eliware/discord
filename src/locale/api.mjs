import { createLocaleStore } from "./store.mjs";
import { createLocaleLookup } from "./lookup.mjs";

const sharedLocaleStore = createLocaleStore();
export const locales = sharedLocaleStore.locales;
export const clearLocales = sharedLocaleStore.clearLocales;
export const msg = createLocaleLookup(locales);
