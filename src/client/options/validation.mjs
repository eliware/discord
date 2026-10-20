import { validateBooleanMap } from "../../option-validation.mjs";
import { INTENT_MAP, PARTIALS_MAP } from "./maps.mjs";
import { mapClientOptionMaps } from "./mapping.mjs";

export const normalizeClientOptionMaps = (intents, partials) => {
  validateBooleanMap(intents, new Set(Object.keys(INTENT_MAP)), "intents");
  validateBooleanMap(partials, new Set(Object.keys(PARTIALS_MAP)), "partials");
  return mapClientOptionMaps(intents, partials);
};
