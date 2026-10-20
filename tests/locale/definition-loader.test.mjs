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

  it.each([
    ["syntax.json", "{", SyntaxError],
    ["null.json", "null", TypeError],
    ["nested.json", '{"nested":{"key":"value"}}', TypeError],
    ["count.json", '{"count":1}', TypeError],
  ])("logs the invalid locale file %s", (file, content, errorType) => {
    expect(loadLocaleDefinitions({ files: [{ file, content }], log })).toEqual([]);
    expect(log.error).toHaveBeenCalledTimes(1);
    expect(log.error).toHaveBeenCalledWith(
      `Failed to load or parse locale file ${file}:`,
      expect.any(errorType),
    );
  });
});
