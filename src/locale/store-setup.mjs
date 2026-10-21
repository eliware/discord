import { storeLocaleDefinitions } from "./store.mjs";

export const replaceLocaleStore = ({
  locales,
  loaded,
  clearLocalesFn,
  storeDefinitions = storeLocaleDefinitions,
}) => {
  clearLocalesFn();
  storeDefinitions({ locales, loaded });
};
