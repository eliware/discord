import { validateCommandDescription } from "../../../src/command/validation/description.mjs";

describe("validateCommandDescription", () => {
  it.each([undefined, 1, "", "x".repeat(101)])("rejects invalid description %#", (description) => {
    expect(validateCommandDescription(description)).toBe("description must be 1-100 characters");
  });

  it("accepts a description within the supported length", () => {
    expect(validateCommandDescription("Help")).toBeNull();
    expect(validateCommandDescription("x".repeat(100))).toBeNull();
  });
});
