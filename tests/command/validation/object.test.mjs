import { validateCommandObject } from "../../../src/command/validation/object.mjs";

describe("validateCommandObject", () => {
  it.each([null, undefined, [], "help", 1])("rejects a non-object definition %#", (definition) => {
    expect(validateCommandObject(definition)).toBe("definition must be an object");
  });

  it("accepts an object definition", () => {
    expect(validateCommandObject({ name: "help" })).toBeNull();
  });
});
