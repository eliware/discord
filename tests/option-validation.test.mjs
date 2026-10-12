import { validateBooleanMap } from "../src/option-validation.mjs";

describe("validateBooleanMap", () => {
  it("validates allowed keys and boolean values", () => {
    const keys = new Set(["enabled"]);
    expect(() => validateBooleanMap({ enabled: true }, keys, "options")).not.toThrow();
    expect(() => validateBooleanMap(undefined, keys, "options")).not.toThrow();
    expect(() => validateBooleanMap([], keys, "options")).not.toThrow();
    expect(() => validateBooleanMap({ other: true }, keys, "options")).toThrow(
      "Unknown options key: other",
    );
    expect(() => validateBooleanMap({ enabled: 1 }, keys, "options")).toThrow(
      "options.enabled must be a boolean.",
    );
    expect(() => validateBooleanMap("bad", keys, "options")).toThrow(
      "options must be an object of boolean values.",
    );
  });
});
