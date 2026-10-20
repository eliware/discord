import { validateBooleanMap } from "../../option-validation.mjs";
import { ALLOWED_INTENT_KEYS, ALLOWED_PARTIAL_KEYS } from "./allowed-keys.mjs";
import { mapClientOptionMaps } from "./mapping.mjs";

export const normalizeClientOptionMaps = (intents, partials) => {
  validateBooleanMap(intents, ALLOWED_INTENT_KEYS, "intents");
  validateBooleanMap(partials, ALLOWED_PARTIAL_KEYS, "partials");
  return mapClientOptionMaps(intents, partials);
};
