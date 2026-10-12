import { jest } from "@jest/globals";
import { validateCommandDefinition } from "../src/command-validation.mjs";
import { setupCommands } from "../src/commands.mjs";

describe("validateCommandDefinition", () => {
  it.each([
    [null, "definition must be an object"],
    [[], "definition must be an object"],
    [{}, "name must be 1-32 characters"],
    [{ name: 1, description: "ok" }, "name must be 1-32 characters"],
    [{ name: "", description: "ok" }, "name must be 1-32 characters"],
    [{ name: "x".repeat(33), description: "ok" }, "name must be 1-32 characters"],
    [{ name: "ok" }, "description must be 1-100 characters"],
    [{ name: "ok", description: 1 }, "description must be 1-100 characters"],
    [{ name: "ok", description: "" }, "description must be 1-100 characters"],
    [{ name: "ok", description: "x".repeat(101) }, "description must be 1-100 characters"],
  ])("rejects invalid definition %#", (definition, message) => {
    expect(validateCommandDefinition(definition)).toBe(message);
  });

  it("accepts a valid definition", () => {
    expect(validateCommandDefinition({ name: "help", description: "Help" })).toBeNull();
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
