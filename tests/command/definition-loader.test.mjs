import { jest } from "@jest/globals";
import { loadCommandDefinitions } from "../../src/command/definition-loader.mjs";

describe("loadCommandDefinitions", () => {
  const log = { error: jest.fn() };
  const commandsDir = "/commands";
  const load = (options) => Array.from(loadCommandDefinitions(options));

  afterEach(() => jest.clearAllMocks());

  it("parses valid command definitions", () => {
    const fsLib = { readFileSync: jest.fn(() => '{"name":"help","description":"Help"}') };
    expect(load({ files: ["help.json"], commandsDir, fsLib, log })).toEqual([
      { name: "help", definition: { name: "help", description: "Help" } },
    ]);
  });

  it("logs schema errors and file name mismatches", () => {
    const fsLib = {
      readFileSync: (file) =>
        file.endsWith("invalid.json")
          ? '{"name":"bad","description":""}'
          : '{"name":"other","description":"Help"}',
    };
    expect(
      load({
        files: ["invalid.json", "help.json"],
        commandsDir,
        fsLib,
        log,
      }),
    ).toEqual([]);
    expect(log.error).toHaveBeenCalledWith(
      "Invalid command definition for invalid.json: description must be 1-100 characters",
    );
    expect(log.error).toHaveBeenCalledWith(
      "Invalid command definition for help.json: name must match file name",
    );
  });

  it("logs file read and JSON parse errors", () => {
    const fsLib = {
      readFileSync: (file) => {
        if (file.endsWith("read.json")) throw new Error("read failed");
        return "{";
      },
    };
    expect(load({ files: ["read.json", "parse.json"], commandsDir, fsLib, log })).toEqual([]);
    expect(log.error).toHaveBeenCalledWith(
      "Failed to load command definition for read.json:",
      expect.any(Error),
    );
    expect(log.error).toHaveBeenCalledWith(
      "Failed to load command definition for parse.json:",
      expect.any(Error),
    );
  });
});
