import { expect, it } from "@jest/globals";
import * as api from "../src/index.mjs";

it("exports the public package API", () => {
  expect(api.createDiscord).toEqual(expect.any(Function));
  expect(api.shutdownDiscord).toBeUndefined();
  expect(api.purgeCommands).toEqual(expect.any(Function));
  expect(api.splitMsg).toEqual(expect.any(Function));
});

describe("splitMsg public API", () => {
  it("checks message and limit types", () => {
    expect(() => api.splitMsg(null)).toThrow(TypeError);
    expect(() => api.splitMsg("hello", 0)).toThrow(RangeError);
    expect(() => api.splitMsg("hello", Number.NaN)).toThrow(RangeError);
    expect(() => api.splitMsg("hello", Infinity)).toThrow(RangeError);
    expect(() => api.splitMsg("hello", 2.5)).toThrow("maxLength must be a positive integer.");
  });

  it("returns empty or unchanged text when it fits", () => {
    expect(api.splitMsg("  ")).toEqual([]);
    expect(api.splitMsg(" hello ", 10)).toEqual(["hello"]);
  });

  it("splits at line breaks, periods, and the length limit", () => {
    expect(api.splitMsg("aa\nbb", 4)).toEqual(["aa", "bb"]);
    expect(api.splitMsg("aa.bb", 4)).toEqual(["aa.", "bb"]);
    expect(api.splitMsg(".abcde", 3)).toEqual([".ab", "cde"]);
    expect(api.splitMsg("abcdef", 3)).toEqual(["abc", "def"]);
  });
});
