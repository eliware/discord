import { jest } from "@jest/globals";
import { loadLocaleDefinitions } from "../../src/locale/definition-loader.mjs";

describe("loadLocaleDefinitions", () => {
  const log = { error: jest.fn() };

  afterEach(() => jest.clearAllMocks());

  it("parses valid locale maps", () => {
    expect(
      loadLocaleDefinitions({ files: [{ file: "en-US.json", content: '{"hello":"Hello"}' }], log }),
    ).toEqual([["en-US", { hello: "Hello" }]]);
  });

  it("logs invalid JSON and invalid locale maps", () => {
    const files = [
      { file: "syntax.json", content: "{" },
      { file: "nested.json", content: '{"nested":{"key":"value"}}' },
    ];
    expect(loadLocaleDefinitions({ files, log })).toEqual([]);
    expect(log.error).toHaveBeenCalledTimes(2);
    expect(log.error).toHaveBeenCalledWith(
      "Failed to load or parse locale file nested.json:",
      expect.any(TypeError),
    );
  });
});
