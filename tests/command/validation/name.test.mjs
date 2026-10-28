import { validateCommandName } from "../../../src/command/validation/name.mjs";

describe("validateCommandName", () => {
  it.each([
    undefined,
    1,
    "",
    "x".repeat(33),
    "HasUppercase",
    "Éclair",
    "has space",
    "bad!",
    "bad'",
  ])("rejects invalid name %#", (name) => {
    expect(validateCommandName(name)).toBe("name must use 1-32 valid Discord command characters");
  });

  it("accepts lowercase letters, numbers, and allowed punctuation", () => {
    expect(validateCommandName("help")).toBeNull();
    expect(validateCommandName("x".repeat(32))).toBeNull();
    expect(validateCommandName("help_me-2ʼ")).toBeNull();
    expect(validateCommandName("café")).toBeNull();
    expect(validateCommandName("éclair")).toBeNull();
    expect(validateCommandName("नमस्ते")).toBeNull();
    expect(validateCommandName("สวัสดี")).toBeNull();
  });
});
