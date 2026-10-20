import { normalizeClientOptionMaps } from "./validation.mjs";

export const createClientOptions = (intents, partials, clientOptions = {}) => ({
  ...normalizeClientOptionMaps(intents, partials),
  ...clientOptions,
});
