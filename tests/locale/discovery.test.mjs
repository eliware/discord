import { jest } from "@jest/globals";

const readLocaleDirectory = jest.fn(() => []);
jest.unstable_mockModule("../../src/locale/directory-reader.mjs", () => ({ readLocaleDirectory }));
const { discoverLocaleFiles } = await import("../../src/locale/discovery.mjs");

describe("discoverLocaleFiles", () => {
  const localesDir = "/locales";

  it("reads names from the directory reader", () => {
    const readDirectory = jest.fn(() => ["en-US.json"]);
    expect(discoverLocaleFiles({ localesDir, readDirectory })).toEqual(["en-US.json"]);
    expect(readDirectory).toHaveBeenCalledWith({ localesDir, fsLib: undefined });
  });

  it("uses the default directory reader", () => {
    readLocaleDirectory.mockReturnValue(["en-US.json"]);
    expect(discoverLocaleFiles()).toEqual(["en-US.json"]);
    expect(readLocaleDirectory).toHaveBeenCalledWith({
      localesDir: expect.any(String),
      fsLib: undefined,
    });
  });
});
