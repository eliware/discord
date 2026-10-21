import { validateBooleanMap } from "../../option-validation.mjs";
import { ALLOWED_INTENT_KEYS, ALLOWED_PARTIAL_KEYS } from "./allowed-keys.mjs";

export const validateClientOptionMaps = (intents, partials) => {
  validateBooleanMap(intents, ALLOWED_INTENT_KEYS, "intents");
  validateBooleanMap(partials, ALLOWED_PARTIAL_KEYS, "partials");
};
