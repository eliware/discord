import { jest } from "@jest/globals";
import { loadLocales } from "../../src/locale/loader.mjs";

describe("loadLocales", () => {
  const log = { error: jest.fn() };
  const localesDir = "/locales";

  afterEach(() => jest.clearAllMocks());

  it("reads valid JSON locale files and skips other files", () => {
    const fsLib = {
      existsSync: jest.fn().mockReturnValue(true),
      readdirSync: jest.fn().mockReturnValue(["en-US.json", "readme.txt"]),
      readFileSync: jest.fn().mockReturnValue('{"hello":"Hello"}'),
    };
    expect(loadLocales({ localesDir, fsLib, log })).toEqual([["en-US", { hello: "Hello" }]]);
    expect(fsLib.readFileSync).toHaveBeenCalledWith(expect.stringContaining("en-US.json"), "utf8");
  });

  it("returns empty when the folder is missing or unreadable", () => {
    expect(
      loadLocales({ localesDir, fsLib: { existsSync: jest.fn().mockReturnValue(false) }, log }),
    ).toEqual([]);
    expect(
      loadLocales({
        localesDir,
        fsLib: {
          readdirSync: () => {
            throw new Error("read");
          },
        },
        log,
      }),
    ).toEqual([]);
  });

  it("logs invalid JSON, invalid maps, and file read errors", () => {
    const fsLib = {
      readdirSync: () => ["syntax.json", "nested.json", "read-error.json"],
      readFileSync: (file) => {
        if (file.endsWith("syntax.json")) return "{";
        if (file.endsWith("nested.json")) return '{"nested":{"key":"value"}}';
        throw new Error("read failed");
      },
    };
    expect(loadLocales({ localesDir, fsLib, log })).toEqual([]);
    expect(log.error).toHaveBeenCalledTimes(3);
    expect(log.error).toHaveBeenCalledWith(
      "Failed to load or parse locale file nested.json:",
      expect.any(TypeError),
    );
  });

  it("uses default options when the default folder is absent", () => {
    expect(loadLocales()).toEqual([]);
  });
});
