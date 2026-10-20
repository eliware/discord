import { jest } from "@jest/globals";
import { discoverCommandFiles } from "../../src/command/discovery.mjs";

describe("discoverCommandFiles", () => {
  const commandsDir = "/commands";

  it("filters discovered names to JSON files", () => {
    const readDirectory = jest.fn(() => ["help.json", "readme.txt"]);
    expect(discoverCommandFiles({ commandsDir, readDirectory })).toEqual(["help.json"]);
    expect(readDirectory).toHaveBeenCalledWith({
      commandsDir,
      fsLib: undefined,
      log: undefined,
    });
  });
});
