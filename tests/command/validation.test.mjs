import { validateCommandDefinition } from "../../src/command/validation.mjs";

describe("validateCommandDefinition", () => {
  it.each([
    [null, "definition must be an object"],
    [[], "definition must be an object"],
    [{}, "name must be 1-32 characters"],
  ])("rejects invalid definition %#", (definition, message) => {
    expect(validateCommandDefinition(definition)).toBe(message);
  });

  it("accepts a valid definition", () => {
    expect(validateCommandDefinition({ name: "help", description: "Help" })).toBeNull();
  });
});
