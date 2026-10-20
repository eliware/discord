import { INTENT_MAP, PARTIALS_MAP } from "./maps.mjs";

export const ALLOWED_INTENT_KEYS = new Set(Object.keys(INTENT_MAP));
export const ALLOWED_PARTIAL_KEYS = new Set(Object.keys(PARTIALS_MAP));
