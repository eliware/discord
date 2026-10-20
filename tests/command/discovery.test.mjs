import { jest } from "@jest/globals";
import { discoverCommandFiles } from "../../src/command/discovery.mjs";

describe("discoverCommandFiles", () => {
  const commandsDir = "/commands";
  const log = { warn: jest.fn() };

  afterEach(() => jest.clearAllMocks());

  it("returns JSON file names and skips other files", () => {
    const fsLib = { readdirSync: jest.fn(() => ["help.json", "readme.txt"]) };
    expect(discoverCommandFiles({ commandsDir, fsLib, log })).toEqual(["help.json"]);
    expect(fsLib.readdirSync).toHaveBeenCalledWith(commandsDir);
  });

  it("warns and returns no names when the directory does not exist", () => {
    const fsLib = { existsSync: jest.fn(() => false) };
    expect(discoverCommandFiles({ commandsDir, fsLib, log })).toEqual([]);
    expect(log.warn).toHaveBeenCalledWith(`Commands directory does not exist: ${commandsDir}`);
  });

  it("warns and returns no names when the directory cannot be read", () => {
    const fsLib = {
      readdirSync: jest.fn(() => {
        throw new Error("read failed");
      }),
    };
    expect(discoverCommandFiles({ commandsDir, fsLib, log })).toEqual([]);
    expect(log.warn).toHaveBeenCalledWith(
      `Commands directory missing or unreadable: ${commandsDir}`,
    );
  });
});
