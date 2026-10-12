import { isPlainObject } from "../src/object-validation.mjs";

describe("isPlainObject", () => {
  it.each([null, [], "value", 1, true])("rejects non-plain object: %p", (value) => {
    expect(isPlainObject(value)).toBe(false);
  });

  it("accepts plain objects and null-prototype objects", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });
});
