import { jest } from "@jest/globals";

const readLocaleDirectory = jest.fn(() => []);
jest.unstable_mockModule("../../src/locale/directory-reader.mjs", () => ({ readLocaleDirectory }));
const { discoverLocaleFiles } = await import("../../src/locale/discovery.mjs");

describe("discoverLocaleFiles", () => {
  const localesDir = "/locales";

  it("returns JSON file names and skips other files", () => {
    const readDirectory = jest.fn(() => ["en-US.json", "readme.txt"]);
    const fsLib = {
      existsSync: jest.fn().mockReturnValue(true),
      readdirSync: jest.fn().mockReturnValue(["en-US.json", "readme.txt"]),
    };
    expect(discoverLocaleFiles({ localesDir, fsLib, readDirectory })).toEqual(["en-US.json"]);
    expect(readDirectory).toHaveBeenCalledWith({ localesDir, fsLib });
  });

  it("filters names returned by the directory reader", () => {
    const readDirectory = jest.fn(() => ["en-US.json", "readme.txt"]);
    expect(discoverLocaleFiles({ localesDir, readDirectory })).toEqual(["en-US.json"]);
    expect(readDirectory).toHaveBeenCalledWith({ localesDir, fsLib: undefined });
  });

  it("uses the default directory reader", () => {
    readLocaleDirectory.mockReturnValue(["en-US.json", "readme.txt"]);
    expect(discoverLocaleFiles()).toEqual(["en-US.json"]);
    expect(readLocaleDirectory).toHaveBeenCalledWith({
      localesDir: expect.any(String),
      fsLib: undefined,
    });
  });
});
