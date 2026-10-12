import { log as sharedLog } from "@eliware/log";
import { jest } from "@jest/globals";

import { setupCommands } from "../src/commands.mjs";
import fs from "fs";

const withSilentDefaultLog = async (fn) => {
  const transports = sharedLog.transports ?? [];
  const previous = transports.map((transport) => transport.silent);
  transports.forEach((transport) => {
    transport.silent = true;
  });
  try {
    return await fn();
  } finally {
    transports.forEach((transport, index) => {
      transport.silent = previous[index];
    });
  }
};

const mockLogger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn(), info: jest.fn() };
const mockFs = {
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
};
const testDir = "test-fixtures/mock-commands";
const testJson = '{"name":"help","description":"Help command"}';
const testHandler = { default: jest.fn() };

beforeAll(() => {
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
  fs.writeFileSync(`${testDir}/help.json`, testJson);
  fs.writeFileSync(
    `${testDir}/help.mjs`,
    "const handler = () => {}; handler(); export default handler",
  );
});
afterAll(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});
afterEach(() => {
  jest.clearAllMocks();
});
describe("setupCommands", () => {
  it("loads and registers commands and handlers", async () => {
    mockFs.readdirSync.mockReturnValue(["help.json"]);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockReturnValue(true);
    const importFn = jest.fn().mockResolvedValue(testHandler);
    const { commandDefs, commandHandlers } = await setupCommands({
      fsLib: mockFs,
      commandsDir: testDir,
      log: mockLogger,
      importFn,
    });
    expect(commandHandlers.help).toBe(testHandler.default);
    expect(commandDefs[0].name).toBe("help");
    expect(importFn).toHaveBeenCalled();
  });

  it("uses the default dynamic import", async () => {
    mockFs.readdirSync.mockReturnValue(["help.json"]);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockReturnValue(true);
    const result = await setupCommands({
      fsLib: mockFs,
      commandsDir: testDir,
      log: mockLogger,
    });
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
});
describe("command validation", () => {
  it("skips invalid command descriptions", async () => {
    mockFs.readdirSync.mockReturnValue(["bad.json"]);
    mockFs.readFileSync.mockReturnValue(
      JSON.stringify({ name: "bad", description: "x".repeat(101) }),
    );
    mockFs.existsSync.mockReturnValue(true);
    const result = await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger });
    expect(result.commandDefs).toEqual([]);
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("Invalid command definition"),
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
  it("uses default setupCommands options", async () => {
    await expect(setupCommands({ log: mockLogger })).resolves.toEqual({
      commandDefs: [],
      commandHandlers: {},
    });
  });

  it("uses the default logger in setupCommands", async () => {
    await expect(
      setupCommands({ commandsDir: "/definitely-missing-commands", log: mockLogger }),
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
