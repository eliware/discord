import { validateCommandDefinition } from "../../src/command/validation.mjs";

describe("validateCommandDefinition", () => {
  it.each([
    [null, "definition must be an object"],
    [[], "definition must be an object"],
    [{}, "name must be 1-32 characters"],
    [{ name: 1, description: "ok" }, "name must be 1-32 characters"],
    [{ name: "", description: "ok" }, "name must be 1-32 characters"],
    [{ name: "x".repeat(33), description: "ok" }, "name must be 1-32 characters"],
    [{ name: "ok" }, "description must be 1-100 characters"],
    [{ name: "ok", description: 1 }, "description must be 1-100 characters"],
    [{ name: "ok", description: "" }, "description must be 1-100 characters"],
    [{ name: "ok", description: "x".repeat(101) }, "description must be 1-100 characters"],
  ])("rejects invalid definition %#", (definition, message) => {
    expect(validateCommandDefinition(definition)).toBe(message);
  });

  it("accepts a valid definition", () => {
    expect(validateCommandDefinition({ name: "help", description: "Help" })).toBeNull();
  });
});
