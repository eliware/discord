import { validateCommandDefinition } from "../../src/command/validation.mjs";

describe("validateCommandDefinition", () => {
  it("returns object validation errors", () => {
    expect(validateCommandDefinition(null)).toBe("definition must be an object");
  });

  it.each([
    [{}, "name must use 1-32 valid Discord command characters"],
    [{ name: "help" }, "description must be 1-100 characters"],
  ])("rejects invalid definition %#", (definition, message) => {
    expect(validateCommandDefinition(definition)).toBe(message);
  });

  it("accepts a valid definition", () => {
    expect(validateCommandDefinition({ name: "help", description: "Help" })).toBeNull();
  });
});
