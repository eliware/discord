import { jest } from "@jest/globals";

const log = { error: jest.fn() };
const discoverLocaleFiles = jest.fn(() => ["en-US.json"]);
const readLocaleFiles = jest.fn(() => [{ file: "en-US.json", content: '{"hello":"Hello"}' }]);
jest.unstable_mockModule("@eliware/log", () => ({ log }));
jest.unstable_mockModule("../../src/locale/discovery.mjs", () => ({ discoverLocaleFiles }));
jest.unstable_mockModule("../../src/locale/file-reader.mjs", () => ({
  readLocaleFiles,
}));
const { loadLocales } = await import("../../src/locale/loader.mjs");

describe("loadLocales", () => {
  const localesDir = "/locales";

  afterEach(() => jest.clearAllMocks());

  it("combines file reading with locale parsing", () => {
    const discoverFiles = jest.fn(() => ["en-US.json"]);
    const readFiles = jest.fn(() => [{ file: "en-US.json", content: '{"hello":"Hello"}' }]);
    expect(loadLocales({ localesDir, discoverFiles, readFiles, log })).toEqual([
      ["en-US", { hello: "Hello" }],
    ]);
    expect(discoverFiles).toHaveBeenCalledWith({ localesDir, fsLib: undefined });
    expect(readFiles).toHaveBeenCalledWith({
      files: ["en-US.json"],
      localesDir,
      fsLib: undefined,
      log,
    });
  });

  it("uses the default directory and file helpers", () => {
    expect(loadLocales()).toEqual([["en-US", { hello: "Hello" }]]);
    expect(discoverLocaleFiles).toHaveBeenCalledWith(
      expect.objectContaining({ localesDir: expect.any(String) }),
    );
    expect(readLocaleFiles).toHaveBeenCalledWith(
      expect.objectContaining({ files: ["en-US.json"] }),
    );
  });
});
