import { createLocaleLookup } from "../locale/lookup.mjs";
import { setupLocaleStore } from "../locale/setup.mjs";
import { createLocaleStore } from "../locale/store.mjs";

export const createClientLocaleStore = () => {
  const store = createLocaleStore();
  const msg = createLocaleLookup(store.locales);
  return {
    msg,
    clearLocales: store.clearLocales,
    setupLocales: (options) =>
      setupLocaleStore({
        ...options,
        locales: store.locales,
        clearLocalesFn: store.clearLocales,
        msg,
      }),
  };
};
