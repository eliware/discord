import { jest } from "@jest/globals";

const readdirSync = jest.fn(() => []);
jest.unstable_mockModule("fs", () => ({ readdirSync }));
const { discoverLocaleFiles } = await import("../../src/locale/discovery.mjs");

describe("discoverLocaleFiles", () => {
  const localesDir = "/locales";

  it("returns JSON file names and skips other files", () => {
    const fsLib = {
      existsSync: jest.fn().mockReturnValue(true),
      readdirSync: jest.fn().mockReturnValue(["en-US.json", "readme.txt"]),
    };
    expect(discoverLocaleFiles({ localesDir, fsLib })).toEqual(["en-US.json"]);
    expect(fsLib.readdirSync).toHaveBeenCalledWith(localesDir);
  });

  it("returns no names when the folder is missing or unreadable", () => {
    expect(
      discoverLocaleFiles({ localesDir, fsLib: { existsSync: jest.fn().mockReturnValue(false) } }),
    ).toEqual([]);
    expect(
      discoverLocaleFiles({
        localesDir,
        fsLib: {
          readdirSync: jest.fn(() => {
            throw new Error("read failed");
          }),
        },
      }),
    ).toEqual([]);
  });

  it("uses the default directory and file reader", () => {
    expect(discoverLocaleFiles()).toEqual([]);
    expect(readdirSync).toHaveBeenCalled();
  });
});
