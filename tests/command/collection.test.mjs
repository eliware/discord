import { jest } from "@jest/globals";

const loadCommandDefinitions = jest.fn();
const loadCommandHandler = jest.fn();
jest.unstable_mockModule("../../src/command/definition-loader.mjs", () => ({
  loadCommandDefinitions,
}));
jest.unstable_mockModule("../../src/command/handler-loader.mjs", () => ({ loadCommandHandler }));
const { createCommandCollection } = await import("../../src/command/collection.mjs");

afterEach(() => {
  jest.clearAllMocks();
});

it("collects definitions with matching handlers", async () => {
  const definition = { name: "ping" };
  const handler = jest.fn();
  loadCommandDefinitions.mockReturnValue([{ name: "ping", definition }]);
  loadCommandHandler.mockResolvedValue(handler);

  await expect(
    createCommandCollection({
      files: ["ping.json"],
      commandsDir: "commands",
      fsLib: {},
      importFn: jest.fn(),
      log: {},
    }),
  ).resolves.toEqual({ commandDefs: [definition], commandHandlers: { ping: handler } });
});

it("omits definitions without handlers", async () => {
  loadCommandDefinitions.mockReturnValue([{ name: "ping", definition: { name: "ping" } }]);
  loadCommandHandler.mockResolvedValue(undefined);

  await expect(
    createCommandCollection({
      files: ["ping.json"],
      commandsDir: "commands",
      fsLib: {},
      importFn: jest.fn(),
      log: {},
    }),
  ).resolves.toEqual({ commandDefs: [], commandHandlers: {} });
});

it("returns empty collections when no definitions exist", async () => {
  loadCommandDefinitions.mockReturnValue([]);

  await expect(
    createCommandCollection({
      files: [],
      commandsDir: "commands",
      fsLib: {},
      importFn: jest.fn(),
      log: {},
    }),
  ).resolves.toEqual({ commandDefs: [], commandHandlers: {} });
  expect(loadCommandHandler).not.toHaveBeenCalled();
});
