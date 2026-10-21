import { validateCommandName } from "../../../src/command/validation/name.mjs";

describe("validateCommandName", () => {
  it.each([undefined, 1, "", "x".repeat(33)])("rejects invalid name %#", (name) => {
    expect(validateCommandName(name)).toBe("name must be 1-32 characters");
  });

  it("accepts a name within the supported length", () => {
    expect(validateCommandName("help")).toBeNull();
    expect(validateCommandName("x".repeat(32))).toBeNull();
  });
});
