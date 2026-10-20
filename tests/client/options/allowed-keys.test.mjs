import { INTENT_MAP, PARTIALS_MAP } from "../../../src/client/options/maps.mjs";
import {
  ALLOWED_INTENT_KEYS,
  ALLOWED_PARTIAL_KEYS,
} from "../../../src/client/options/allowed-keys.mjs";

describe("client option allowed keys", () => {
  it("matches the configured intent and partial maps", () => {
    expect(ALLOWED_INTENT_KEYS).toEqual(new Set(Object.keys(INTENT_MAP)));
    expect(ALLOWED_PARTIAL_KEYS).toEqual(new Set(Object.keys(PARTIALS_MAP)));
  });
});
