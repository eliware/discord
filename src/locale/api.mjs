import { createLocaleStore } from "./store.mjs";

const sharedLocaleStore = createLocaleStore();
export const locales = sharedLocaleStore.locales;
export const clearLocales = sharedLocaleStore.clearLocales;
