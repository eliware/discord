import { jest } from "@jest/globals";

const readFileSync = jest.fn(() => "{}");
const log = { error: jest.fn() };
jest.unstable_mockModule("fs", () => ({ readFileSync }));
jest.unstable_mockModule("@eliware/log", () => ({ log }));
const { readLocaleFiles } = await import("../../src/locale/file-reader.mjs");

describe("readLocaleFiles", () => {
  const localesDir = "/locales";
  afterEach(() => jest.clearAllMocks());

  it("reads each discovered file", () => {
    const fsLib = { readFileSync: jest.fn().mockReturnValue('{"hello":"Hello"}') };
    expect(readLocaleFiles({ files: ["en-US.json"], localesDir, fsLib, log })).toEqual([
      { file: "en-US.json", content: '{"hello":"Hello"}' },
    ]);
    expect(fsLib.readFileSync).toHaveBeenCalledWith(expect.stringContaining("en-US.json"), "utf8");
  });

  it("logs and skips a file that cannot be read", () => {
    const error = new Error("file read failed");
    const result = readLocaleFiles({
      files: ["en-US.json"],
      localesDir,
      fsLib: {
        readFileSync: jest.fn(() => {
          throw error;
        }),
      },
      log,
    });
    expect(result).toEqual([]);
    expect(log.error).toHaveBeenCalledWith(
      "Failed to load or parse locale file en-US.json:",
      error,
    );
  });

  it("uses the default reader and logger", () => {
    expect(readLocaleFiles({ files: ["en-US.json"], localesDir })).toEqual([
      { file: "en-US.json", content: "{}" },
    ]);
    expect(readFileSync).toHaveBeenCalled();
  });
});
