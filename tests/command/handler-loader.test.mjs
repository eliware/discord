import { jest } from "@jest/globals";
import { loadCommandHandler } from "../../src/command/handler-loader.mjs";

describe("loadCommandHandler", () => {
  const log = { warn: jest.fn() };
  const commandsDir = "/commands";
  const fsLib = { existsSync: jest.fn() };

  afterEach(() => jest.clearAllMocks());

  it("returns an imported default function", async () => {
    const handler = jest.fn();
    const importFn = jest.fn().mockResolvedValue({ default: handler });
    await expect(
      loadCommandHandler({ name: "help", commandsDir, fsLib: {}, importFn, log }),
    ).resolves.toBe(handler);
    expect(importFn).toHaveBeenCalledWith(expect.stringContaining("help.mjs"));
  });

  it("warns when the handler file is missing", async () => {
    fsLib.existsSync.mockReturnValue(false);
    const importFn = jest.fn();
    await expect(
      loadCommandHandler({ name: "help", commandsDir, fsLib, importFn, log }),
    ).resolves.toBeUndefined();
    expect(importFn).not.toHaveBeenCalled();
    expect(log.warn).toHaveBeenCalledWith("No handler found for command help");
  });

  it("warns when the handler module has no default function", async () => {
    fsLib.existsSync.mockReturnValue(true);
    await loadCommandHandler({
      name: "help",
      commandsDir,
      fsLib,
      importFn: jest.fn().mockResolvedValue({ default: "invalid" }),
      log,
    });
    expect(log.warn).toHaveBeenCalledWith("Handler for help does not export a default function.");
  });

  it("warns when the handler import fails", async () => {
    fsLib.existsSync.mockReturnValue(true);
    const error = new Error("import failed");
    await loadCommandHandler({
      name: "help",
      commandsDir,
      fsLib,
      importFn: jest.fn().mockRejectedValue(error),
      log,
    });
    expect(log.warn).toHaveBeenCalledWith("Failed to load handler for help:", error);
  });
});
