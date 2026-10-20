import { jest } from "@jest/globals";
import { loadLocales } from "../../src/locale/loader.mjs";

describe("loadLocales", () => {
  const log = { error: jest.fn() };
  const localesDir = "/locales";

  afterEach(() => jest.clearAllMocks());

  it("parses valid locale file contents", () => {
    const readFiles = jest.fn(() => [{ file: "en-US.json", content: '{"hello":"Hello"}' }]);
    expect(loadLocales({ localesDir, readFiles, log })).toEqual([["en-US", { hello: "Hello" }]]);
    expect(readFiles).toHaveBeenCalledWith({ localesDir, fsLib: undefined, log });
  });

  it("logs invalid JSON and invalid maps", () => {
    const readFiles = () => [
      { file: "syntax.json", content: "{" },
      { file: "nested.json", content: '{"nested":{"key":"value"}}' },
    ];
    expect(loadLocales({ localesDir, readFiles, log })).toEqual([]);
    expect(log.error).toHaveBeenCalledTimes(2);
    expect(log.error).toHaveBeenCalledWith(
      "Failed to load or parse locale file nested.json:",
      expect.any(TypeError),
    );
  });

  it("uses default options when the default folder is absent", () => {
    expect(loadLocales()).toEqual([]);
  });
});
