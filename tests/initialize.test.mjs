import { jest } from "@jest/globals";
import { initializeDiscord } from "../src/initialize.mjs";

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

describe("initializeDiscord", () => {
  it("sets up app files and reports counts", async () => {
    const msg = jest.fn();
    const commandHandlers = { help: jest.fn() };
    const cleanup = jest.fn();
    const registerCommandsFn = jest.fn().mockResolvedValue(true);
    const result = await initializeDiscord({
      ...base,
      setupLocalesFn: () => ({ msg, loadedLocales: ["en-US"] }),
      setupCommandsFn: async () => ({ commandDefs: [{ name: "help" }], commandHandlers }),
      setupEventsFn: async () => ({ loadedEvents: ["ready"], cleanup }),
      registerCommandsFn,
    });
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
    expect(log.warn).toHaveBeenCalledWith("No commands to register.");
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
    [
      "events",
      { setupEventsFn: async () => ({ loadedEvents: "bad" }) },
      "setupEventsFn must return",
    ],
  ])("rejects invalid %s results", async (_name, override, message) => {
    await expect(initializeDiscord({ ...base, ...override })).rejects.toThrow(message);
  });

  it("cleans event handlers when command registration fails", async () => {
    const cleanup = jest.fn();
    await expect(
      initializeDiscord({
        ...base,
        setupCommandsFn: async () => ({ commandDefs: [{ name: "help" }], commandHandlers: {} }),
        setupEventsFn: async () => ({ loadedEvents: [], cleanup }),
        registerCommandsFn: async () => false,
      }),
    ).rejects.toThrow("Failed to register commands");
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it("cleans event handlers when the setup result is invalid", async () => {
    const cleanup = jest.fn();
    await expect(
      initializeDiscord({
        ...base,
        setupEventsFn: async () => ({ loadedEvents: "bad", cleanup }),
      }),
    ).rejects.toThrow("setupEventsFn must return");
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it("cleans custom event listeners when registration fails without a cleanup callback", async () => {
    const listeners = new Map();
    const off = jest.fn((name, listener) => {
      listeners.set(
        name,
        listeners.get(name).filter((item) => item !== listener),
      );
    });
    const client = {
      eventNames: () => [...listeners.keys()],
      listeners: (name) => listeners.get(name) ?? [],
      on: (name, listener) => listeners.set(name, [...(listeners.get(name) ?? []), listener]),
      off,
    };
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
    ).rejects.toThrow("Failed to register commands");
    expect(off).toHaveBeenCalledTimes(1);
    expect(listeners.get("ready")).toEqual([]);
  });

  it("removes new custom listeners and keeps existing listeners", async () => {
    const existingListener = jest.fn();
    const addedListener = jest.fn();
    const listeners = new Map([["ready", [existingListener]]]);
    const removeListener = jest.fn((name, listener) => {
      listeners.set(
        name,
        listeners.get(name).filter((item) => item !== listener),
      );
    });
    const client = {
      eventNames: () => [...listeners.keys()],
      listeners: (name) => listeners.get(name) ?? [],
      on: (name, listener) => listeners.set(name, [...(listeners.get(name) ?? []), listener]),
      removeListener,
    };
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
    const listeners = new Map();
    const off = jest.fn((name, listener) => {
      listeners.set(
        name,
        listeners.get(name).filter((item) => item !== listener),
      );
    });
    const client = {
      eventNames: () => [...listeners.keys()],
      listeners: (name) => listeners.get(name) ?? [],
      on: (name, listener) => listeners.set(name, [...(listeners.get(name) ?? []), listener]),
      off,
    };
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

  it("uses the default loaders for missing app folders", async () => {
    await expect(
      initializeDiscord({
        client: {},
        localesDir: "missing-locales",
        commandsDir: "missing-commands",
        eventsDir: "missing-events",
        log,
        context: {},
      }),
    ).resolves.toEqual(expect.any(Function));
  });
});
