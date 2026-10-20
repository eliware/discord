import { jest } from "@jest/globals";

const readdirSync = jest.fn(() => []);
jest.unstable_mockModule("fs", () => ({ readdirSync }));
const { readLocaleDirectory } = await import("../../src/locale/directory-reader.mjs");

describe("readLocaleDirectory", () => {
  const localesDir = "/locales";

  afterEach(() => jest.clearAllMocks());

  it("returns directory entries", () => {
    const fsLib = {
      existsSync: jest.fn(() => true),
      readdirSync: jest.fn(() => ["en-US.json"]),
    };
    expect(readLocaleDirectory({ localesDir, fsLib })).toEqual(["en-US.json"]);
    expect(fsLib.existsSync).toHaveBeenCalledWith(localesDir);
    expect(fsLib.readdirSync).toHaveBeenCalledWith(localesDir);
  });

  it("returns no entries when the folder does not exist", () => {
    const fsLib = { existsSync: jest.fn(() => false), readdirSync: jest.fn() };
    expect(readLocaleDirectory({ localesDir, fsLib })).toEqual([]);
    expect(fsLib.readdirSync).not.toHaveBeenCalled();
  });

  it("returns no entries when the folder cannot be read", () => {
    const fsLib = {
      readdirSync: jest.fn(() => {
        throw new Error("read failed");
      }),
    };
    expect(readLocaleDirectory({ localesDir, fsLib })).toEqual([]);
  });

  it("uses the default directory reader", () => {
    expect(readLocaleDirectory()).toEqual([]);
    expect(readdirSync).toHaveBeenCalledWith(undefined);
  });
});
