import { jest } from "@jest/globals";
import { readLocaleFiles } from "../../src/locale/files.mjs";

describe("readLocaleFiles", () => {
  const localesDir = "/locales";
  const log = { error: jest.fn() };

  afterEach(() => jest.clearAllMocks());

  it("reads JSON files and skips other files", () => {
    const fsLib = {
      existsSync: jest.fn().mockReturnValue(true),
      readdirSync: jest.fn().mockReturnValue(["en-US.json", "readme.txt"]),
      readFileSync: jest.fn().mockReturnValue('{"hello":"Hello"}'),
    };
    expect(readLocaleFiles({ localesDir, fsLib, log })).toEqual([
      { file: "en-US.json", content: '{"hello":"Hello"}' },
    ]);
    expect(fsLib.readFileSync).toHaveBeenCalledWith(expect.stringContaining("en-US.json"), "utf8");
  });

  it("returns no files when the folder is missing or unreadable", () => {
    expect(
      readLocaleFiles({ localesDir, fsLib: { existsSync: jest.fn().mockReturnValue(false) } }),
    ).toEqual([]);
    expect(
      readLocaleFiles({
        localesDir,
        fsLib: {
          readdirSync: () => {
            throw new Error("read failed");
          },
        },
      }),
    ).toEqual([]);
  });

  it("returns read errors with their file names", () => {
    const error = new Error("file read failed");
    const result = readLocaleFiles({
      localesDir,
      fsLib: {
        readdirSync: () => ["en-US.json"],
        readFileSync: () => {
          throw error;
        },
      },
      log,
    });
    expect(result).toEqual([]);
    expect(log.error).toHaveBeenCalledWith(
      "Failed to load or parse locale file en-US.json:",
      error,
    );
  });

  it("uses default options when the default folder is absent", () => {
    expect(readLocaleFiles()).toEqual([]);
  });
});
