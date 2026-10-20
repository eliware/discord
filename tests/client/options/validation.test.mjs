import { normalizeClientOptionMaps } from "../../../src/client/options/validation.mjs";

describe("normalizeClientOptionMaps", () => {
  it("rejects unknown intent and partial names", () => {
    expect(() => normalizeClientOptionMaps({ Bad: true }, undefined)).toThrow(
      "Unknown intents key",
    );
    expect(() => normalizeClientOptionMaps(undefined, { Bad: true })).toThrow(
      "Unknown partials key",
    );
  });
});
