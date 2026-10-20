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

  it("warns when handler has no default function", async () => {
    mockFs.readdirSync.mockReturnValue(["help.json"]);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockReturnValue(true);
    await setupCommands({
      fsLib: mockFs,
      commandsDir: testDir,
      log: mockLogger,
      importFn: jest.fn().mockResolvedValue({ default: "nope" }),
    });
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "Handler for help does not export a default function.",
    );
  });

  it("warns when handler import fails", async () => {
    mockFs.readdirSync.mockReturnValue(["help.json"]);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockReturnValue(true);
    const error = new Error("import fail");
    await setupCommands({
      fsLib: mockFs,
      commandsDir: testDir,
      log: mockLogger,
      importFn: jest.fn().mockRejectedValue(error),
    });
    expect(mockLogger.warn).toHaveBeenCalledWith("Failed to load handler for help:", error);
  });

  it("skips non-json files", async () => {
    mockFs.readdirSync.mockReturnValue(["readme.txt"]);
    expect(await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger })).toEqual({
      commandDefs: [],
      commandHandlers: {},
    });
  });

  it("logs error if command definition fails", async () => {
    mockFs.readdirSync.mockReturnValue(["bad.json"]);
    mockFs.readFileSync.mockImplementation(() => {
      throw new Error("fail");
    });
    mockFs.existsSync.mockReturnValue(true);
    const importFn = jest.fn();
    await setupCommands({
      fsLib: mockFs,
      commandsDir: testDir,
      log: mockLogger,
      importFn,
    });
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to load command definition for bad.json:"),
      expect.any(Error),
    );
  });

  it("skips invalid definitions during command loading", async () => {
    const log = { error: jest.fn() };
    const result = await setupCommands({
      commandsDir: "/commands",
      log,
      fsLib: {
        readdirSync: () => ["bad.json"],
        readFileSync: () => JSON.stringify({ name: "bad", description: "x".repeat(101) }),
        existsSync: () => true,
      },
    });
    expect(result.commandDefs).toEqual([]);
    expect(log.error).toHaveBeenCalledWith(expect.stringContaining("Invalid command definition"));
  });

  it("skips definitions whose names do not match their files", async () => {
    const log = { error: jest.fn() };
    const result = await setupCommands({
      commandsDir: "/commands",
      log,
      fsLib: {
        readdirSync: () => ["start.json", "stop.json"],
        readFileSync: () => JSON.stringify({ name: "shared", description: "Start" }),
        existsSync: () => true,
      },
      importFn: jest.fn(),
    });
    expect(result.commandDefs).toEqual([]);
    expect(result.commandHandlers).toEqual({});
    expect(log.error).toHaveBeenCalledTimes(2);
    expect(log.error).toHaveBeenCalledWith(
      "Invalid command definition for start.json: name must match file name",
    );
  });
});

describe("remaining command loader branch", () => {
  it("warns when a command handler file is absent", async () => {
    mockFs.readdirSync.mockReturnValue(["help.json"]);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockImplementation((file) => file === testDir);
    await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger });
    expect(mockLogger.warn).toHaveBeenCalledWith("No handler found for command help");
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
