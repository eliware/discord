import { isPlainObject } from "../object-validation.mjs";

/** Validate a locale payload as a flat string map. */
export const validateLocale = (value) => {
  if (!isPlainObject(value)) return false;
  return Object.values(value).every((message) => typeof message === "string");
};
