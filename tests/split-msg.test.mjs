import { splitMsg } from "../src/split-msg.mjs";

describe("splitMsg", () => {
  it("checks message and limit types", () => {
    expect(() => splitMsg(null)).toThrow(TypeError);
    expect(() => splitMsg("hello", 0)).toThrow(RangeError);
    expect(() => splitMsg("hello", Number.NaN)).toThrow(RangeError);
    expect(() => splitMsg("hello", Infinity)).toThrow(RangeError);
    expect(() => splitMsg("hello", 2.5)).toThrow("maxLength must be a positive integer.");
  });

  it("returns empty or unchanged text when it fits", () => {
    expect(splitMsg("  ")).toEqual([]);
    expect(splitMsg(" hello ", 10)).toEqual(["hello"]);
  });

  it("splits at line breaks, periods, and the length limit", () => {
    expect(splitMsg("aa\nbb", 4)).toEqual(["aa", "bb"]);
    expect(splitMsg("aa.bb", 4)).toEqual(["aa.", "bb"]);
    expect(splitMsg(".abcde", 3)).toEqual([".ab", "cde"]);
    expect(splitMsg("abcdef", 3)).toEqual(["abc", "def"]);
  });

  it("does not return empty chunks for repeated line breaks", () => {
    expect(splitMsg("a\n\nb", 2)).toEqual(["a", "b"]);
  });
});
