import { jest } from "@jest/globals";

import { setupCommands } from "../src/commands.mjs";
import {
  mockLogger,
  mockFs,
  testDir,
  testJson,
  testHandler,
  resetMocks,
} from "../test-fixtures/commands/test-support.mjs";
import { withSilentDefaultLog } from "../test-fixtures/test-support.mjs";

const setupMockCommands = (options = {}) =>
  setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger, ...options });

afterEach(() => {
  resetMocks();
});
describe("setupCommands", () => {
  it("loads and registers commands and handlers", async () => {
    mockFs.readdirSync.mockReturnValue(["help.json"]);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockReturnValue(true);
    const importFn = jest.fn().mockResolvedValue(testHandler);
    const { commandDefs, commandHandlers } = await setupMockCommands({ importFn });
    expect(commandHandlers.help).toBe(testHandler.default);
    expect(commandDefs[0].name).toBe("help");
    expect(importFn).toHaveBeenCalled();
  });

  it("keys handlers by the registered command name", async () => {
    const definition = { name: "start", description: "Start the app" };
    mockFs.readdirSync.mockReturnValue(["start.json"]);
    mockFs.readFileSync.mockReturnValue(JSON.stringify(definition));
    mockFs.existsSync.mockReturnValue(true);
    const handler = jest.fn();
    const result = await setupMockCommands({
      importFn: jest.fn().mockResolvedValue({ default: handler }),
    });
    expect(result.commandHandlers.start).toBe(handler);
  });

  it("uses the default dynamic import", async () => {
    mockFs.readdirSync.mockReturnValue(["help.json"]);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockReturnValue(true);
    const result = await setupMockCommands();
    expect(result.commandDefs).toEqual([JSON.parse(testJson)]);
    expect(result.commandHandlers.help).toEqual(expect.any(Function));
  });

  it("omits definitions when a handler file is missing", async () => {
    mockFs.readdirSync.mockReturnValue(["help.json"]);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockImplementation((file) => file === testDir);
    await expect(setupMockCommands()).resolves.toEqual({ commandDefs: [], commandHandlers: {} });
    expect(mockLogger.warn).toHaveBeenCalledWith("No handler found for command help");
  });

  it("returns empty when directory does not exist", async () => {
    mockFs.existsSync.mockReturnValue(false);
    expect(await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger })).toEqual({
      commandDefs: [],
      commandHandlers: {},
    });
    expect(mockLogger.warn).toHaveBeenCalledWith(`Commands directory does not exist: ${testDir}`);
  });

  it("handles unreadable directory", async () => {
    mockFs.existsSync.mockImplementation(() => {
      throw new Error("fail");
    });
    expect(await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger })).toEqual({
      commandDefs: [],
      commandHandlers: {},
    });
    expect(mockLogger.warn).toHaveBeenCalledWith(
      `Commands directory missing or unreadable: ${testDir}`,
    );
  });

  it("skips non-json files", async () => {
    mockFs.readdirSync.mockReturnValue(["readme.txt"]);
    expect(await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger })).toEqual({
      commandDefs: [],
      commandHandlers: {},
    });
  });
});

describe("default logger branches", () => {
  it("returns empty results for default and missing folders", async () => {
    await expect(setupCommands({ log: mockLogger })).resolves.toEqual({
      commandDefs: [],
      commandHandlers: {},
    });
    await expect(
      setupCommands({
        commandsDir: "/definitely-missing-commands",
        fsLib: { existsSync: jest.fn().mockReturnValue(false) },
        log: mockLogger,
      }),
    ).resolves.toEqual({ commandDefs: [], commandHandlers: {} });
  });
});

describe("default argument coverage", () => {
  it("covers setupCommands defaults", async () => {
    await withSilentDefaultLog(async () => {
      await expect(setupCommands()).resolves.toEqual({ commandDefs: [], commandHandlers: {} });
    });
  });
});
