import { clearLocales } from "../locale/api.mjs";

export const cleanupShutdownLocales = (clearLocalesFn = clearLocales) => clearLocalesFn();
