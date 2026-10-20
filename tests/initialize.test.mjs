import { jest } from "@jest/globals";
import { createListenerClient } from "../test-fixtures/initialize-listener-client.mjs";

const defaultSetupLocalesFn = jest.fn(() => ({ msg: jest.fn(), loadedLocales: ["en-US"] }));
const defaultSetupCommandsFn = jest.fn(async () => ({ commandDefs: [], commandHandlers: {} }));
const defaultSetupEventsFn = jest.fn(async () => ({ loadedEvents: [] }));
const defaultRegisterCommandsFn = jest.fn(async () => true);

jest.unstable_mockModule("../src/locales.mjs", () => ({ setupLocales: defaultSetupLocalesFn }));
jest.unstable_mockModule("../src/commands.mjs", () => ({ setupCommands: defaultSetupCommandsFn }));
jest.unstable_mockModule("../src/events.mjs", () => ({ setupEvents: defaultSetupEventsFn }));
jest.unstable_mockModule("../src/command/registration.mjs", () => ({
  registerCommands: defaultRegisterCommandsFn,
}));

const { initializeDiscord } = await import("../src/initialize.mjs");

const log = { error: jest.fn(), info: jest.fn(), warn: jest.fn() };
const base = {
  client: {},
  clientId: "cid",
  token: "token",
  localesDir: "locales",
  commandsDir: "commands",
  eventsDir: "events",
  log,
  context: {},
  setupLocalesFn: () => ({ msg: jest.fn(), loadedLocales: ["en-US"] }),
  setupCommandsFn: async () => ({ commandDefs: [], commandHandlers: {} }),
  setupEventsFn: async () => ({ loadedEvents: ["ready"] }),
};

afterEach(() => jest.clearAllMocks());

it("sets up app files and reports counts", async () => {
  const msg = jest.fn();
  const commandHandlers = { help: jest.fn() };
  const cleanup = jest.fn();
  const registerCommandsFn = jest.fn().mockResolvedValue(true);
  const setupLocalesFn = jest.fn().mockReturnValue({ msg, loadedLocales: ["en-US"] });
  const setupCommandsFn = jest
    .fn()
    .mockResolvedValue({ commandDefs: [{ name: "help" }], commandHandlers });
  const setupEventsFn = jest.fn().mockResolvedValue({ loadedEvents: ["ready"], cleanup });
  const result = await initializeDiscord({
    ...base,
    setupLocalesFn,
    setupCommandsFn,
    setupEventsFn,
    registerCommandsFn,
  });
  expect(setupLocalesFn).toHaveBeenCalledTimes(1);
  expect(setupCommandsFn).toHaveBeenCalledTimes(1);
  expect(setupEventsFn).toHaveBeenCalledTimes(1);
  expect(registerCommandsFn).toHaveBeenCalledWith(
    expect.objectContaining({ clientId: "cid", token: "token" }),
  );
  expect(result).toBe(cleanup);
  expect(log.info).toHaveBeenCalledWith("Discord app initialized", {
    eventCount: 1,
    localeCount: 1,
    commandCount: 1,
  });
});

it("warns when no commands exist and returns default event cleanup", async () => {
  const cleanup = await initializeDiscord({
    ...base,
    setupCommandsFn: async () => ({ commandHandlers: {} }),
  });
  expect(log.warn).toHaveBeenCalledWith("No commands are available to send.");
  expect(cleanup).toEqual(expect.any(Function));
  cleanup();
});

it.each([
  ["locale", { setupLocalesFn: () => ({}) }, "setupLocalesFn must return"],
  [
    "commands",
    { setupCommandsFn: async () => ({ commandDefs: "bad", commandHandlers: {} }) },
    "setupCommandsFn must return",
  ],
  ["events", { setupEventsFn: async () => ({ loadedEvents: "bad" }) }, "setupEventsFn must return"],
])("rejects invalid %s results", async (_name, override, message) => {
  await expect(initializeDiscord({ ...base, ...override })).rejects.toThrow(message);
});

it.each([
  [
    "command registration fails",
    {
      setupCommandsFn: async () => ({ commandDefs: [{ name: "help" }], commandHandlers: {} }),
      setupEventsFn: async () => ({ loadedEvents: [], cleanup: jest.fn() }),
      registerCommandsFn: async () => false,
    },
    "Discord did not accept the commands",
  ],
  [
    "the event setup result is invalid",
    { setupEventsFn: async () => ({ loadedEvents: "bad", cleanup: jest.fn() }) },
    "setupEventsFn must return",
  ],
])("cleans event handlers when %s", async (_case, override, message) => {
  const cleanup = jest.fn();
  const setupEventsFn = override.setupEventsFn ?? base.setupEventsFn;
  await expect(
    initializeDiscord({
      ...base,
      ...override,
      setupEventsFn: async (...args) => {
        const result = await setupEventsFn(...args);
        return { ...result, cleanup };
      },
    }),
  ).rejects.toThrow(message);
  expect(cleanup).toHaveBeenCalledTimes(1);
});

it("cleans custom event listeners when registration fails without a cleanup callback", async () => {
  const { client, listeners, remove: off } = createListenerClient(jest);
  await expect(
    initializeDiscord({
      ...base,
      client,
      setupCommandsFn: async () => ({ commandDefs: [{ name: "help" }], commandHandlers: {} }),
      setupEventsFn: async ({ client: target }) => {
        target.on("ready", jest.fn());
        return { loadedEvents: ["ready"] };
      },
      registerCommandsFn: async () => false,
    }),
  ).rejects.toThrow("Discord did not accept the commands");
  expect(off).toHaveBeenCalledTimes(1);
  expect(listeners.get("ready")).toEqual([]);
});

it("removes new custom listeners and keeps existing listeners", async () => {
  const existingListener = jest.fn();
  const addedListener = jest.fn();
  const {
    client,
    listeners,
    remove: removeListener,
  } = createListenerClient(jest, new Map([["ready", [existingListener]]]));
  const cleanup = await initializeDiscord({
    ...base,
    client,
    setupEventsFn: async ({ client: target }) => {
      target.on("ready", addedListener);
      return { loadedEvents: ["ready"] };
    },
  });
  cleanup();
  expect(removeListener).toHaveBeenCalledWith("ready", addedListener);
  expect(listeners.get("ready")).toEqual([existingListener]);
});

it("cleans custom listeners when event setup throws", async () => {
  const { client, listeners, remove: off } = createListenerClient(jest);
  client.on.mockImplementation((name, listener) => {
    listeners.set(name, [...(listeners.get(name) ?? []), listener]);
  });
  await expect(
    initializeDiscord({
      ...base,
      client,
      setupEventsFn: async ({ client: target }) => {
        target.on("ready", jest.fn());
        throw new Error("setup failed");
      },
    }),
  ).rejects.toThrow("setup failed");
  expect(off).toHaveBeenCalledTimes(1);
  expect(listeners.get("ready")).toEqual([]);
});

it("uses mocked default loaders", async () => {
  const cleanup = await initializeDiscord({ client: {}, log, context: {} });
  expect(defaultSetupLocalesFn).toHaveBeenCalledTimes(1);
  expect(defaultSetupCommandsFn).toHaveBeenCalledTimes(1);
  expect(defaultSetupEventsFn).toHaveBeenCalledTimes(1);
  expect(defaultRegisterCommandsFn).not.toHaveBeenCalled();
  expect(cleanup).toEqual(expect.any(Function));
});
