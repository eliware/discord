import { jest } from "@jest/globals";
import { readCommandDirectory } from "../../src/command/directory-reader.mjs";

describe("readCommandDirectory", () => {
  const commandsDir = "/commands";
  const log = { warn: jest.fn() };

  afterEach(() => jest.clearAllMocks());

  it("reads entries when the directory exists", () => {
    const fsLib = {
      existsSync: jest.fn(() => true),
      readdirSync: jest.fn(() => ["help.json"]),
    };
    expect(readCommandDirectory({ commandsDir, fsLib, log })).toEqual(["help.json"]);
    expect(fsLib.readdirSync).toHaveBeenCalledWith(commandsDir);
  });

  it("reads entries when no existence check is available", () => {
    const fsLib = { readdirSync: jest.fn(() => ["help.json"]) };
    expect(readCommandDirectory({ commandsDir, fsLib, log })).toEqual(["help.json"]);
  });

  it("warns when the directory does not exist", () => {
    const fsLib = { existsSync: jest.fn(() => false), readdirSync: jest.fn() };
    expect(readCommandDirectory({ commandsDir, fsLib, log })).toEqual([]);
    expect(log.warn).toHaveBeenCalledWith(`Commands directory does not exist: ${commandsDir}`);
    expect(fsLib.readdirSync).not.toHaveBeenCalled();
  });

  it("warns when the directory cannot be read", () => {
    const fsLib = {
      readdirSync: jest.fn(() => {
        throw new Error("read failed");
      }),
    };
    expect(readCommandDirectory({ commandsDir, fsLib, log })).toEqual([]);
    expect(log.warn).toHaveBeenCalledWith(
      `Commands directory missing or unreadable: ${commandsDir}`,
    );
  });
});
