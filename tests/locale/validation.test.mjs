import { validateLocale } from "../../src/locale/validation.mjs";

describe("validateLocale", () => {
  it("accepts flat string maps and rejects other values", () => {
    expect(validateLocale({ hello: "Hello" })).toBe(true);
    expect(validateLocale(null)).toBe(false);
    expect(validateLocale({ nested: { value: "no" } })).toBe(false);
    expect(validateLocale({ count: 1 })).toBe(false);
  });
});
