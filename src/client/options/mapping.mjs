import { DEFAULT_INTENTS, DEFAULT_PARTIALS, INTENT_MAP, PARTIALS_MAP } from "./maps.mjs";

export const mapClientOptionMaps = (intents = {}, partials = {}) => ({
  intents: Object.entries({ ...DEFAULT_INTENTS, ...intents })
    .filter(([key, enabled]) => enabled && key in INTENT_MAP)
    .map(([key]) => INTENT_MAP[key]),
  partials: Object.entries({ ...DEFAULT_PARTIALS, ...partials })
    .filter(([key, enabled]) => enabled && key in PARTIALS_MAP)
    .map(([key]) => PARTIALS_MAP[key]),
});
