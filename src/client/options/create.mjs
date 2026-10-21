import { normalizeClientOptionMaps } from "./validation.mjs";
import { mergeClientOptions } from "./merge.mjs";

export const createClientOptions = (intents, partials, clientOptions = {}) =>
  mergeClientOptions(normalizeClientOptionMaps(intents, partials), clientOptions);
