import { validateClientOptionMaps } from "../../../src/client/options/validation.mjs";

describe("validateClientOptionMaps", () => {
  it("rejects unknown intent and partial names", () => {
    expect(() => validateClientOptionMaps({ Bad: true }, undefined)).toThrow("Unknown intents key");
    expect(() => validateClientOptionMaps(undefined, { Bad: true })).toThrow(
      "Unknown partials key",
    );
  });

  it("accepts omitted option maps", () => {
    expect(validateClientOptionMaps(undefined, undefined)).toBeUndefined();
  });
});
