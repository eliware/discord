import { clearLocales } from "../locale/store.mjs";

export const cleanupShutdownLocales = (clearLocalesFn = clearLocales) => clearLocalesFn();
