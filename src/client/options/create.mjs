import { validateClientOptionMaps } from "./validation.mjs";
import { mapClientOptionMaps } from "./mapping.mjs";
import { mergeClientOptions } from "./merge.mjs";

export const createClientOptions = (intents, partials, clientOptions = {}) => {
  validateClientOptionMaps(intents, partials);
  return mergeClientOptions(mapClientOptionMaps(intents, partials), clientOptions);
};
