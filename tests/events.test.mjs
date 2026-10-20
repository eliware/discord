import { setupEvents } from "../src/events.mjs";
import { jest } from "@jest/globals";
import { withSilentDefaultLog } from "../test-fixtures/test-support.mjs";

describe("setupEvents", () => {
  const logger = () => ({ info: jest.fn(), error: jest.fn(), warn: jest.fn() });

  it("loads, attaches, invokes, and cleans up handlers", async () => {
    const client = { on: jest.fn(), off: jest.fn() };
    const handler = jest.fn();
    const log = logger();
    const result = await setupEvents({
      client,
      eventsDir: "/events",
      log,
      msg: jest.fn(),
      context: { extra: 1 },
      fsLib: { readdirSync: jest.fn(() => ["ready.mjs", "ignored.js"]) },
      importFn: jest.fn().mockResolvedValue({ default: handler }),
    });

    expect(result.loadedEvents).toEqual(["ready"]);
    const listener = client.on.mock.calls[0][1];
    listener("arg");
    await Promise.resolve();
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ client, log, msg: expect.any(Function), extra: 1 }),
      "arg",
    );
    result.cleanup();
    expect(client.off).toHaveBeenCalledWith("ready", listener);
  });

  it("passes command handlers to interaction handlers", async () => {
    const client = { on: jest.fn() };
    const handler = jest.fn();
    const commandHandlers = { ping: jest.fn() };
    await setupEvents({
      client,
      eventsDir: "/events",
      commandHandlers,
      fsLib: { readdirSync: () => ["interactionCreate.mjs"] },
      importFn: async () => ({ default: handler }),
    });
    client.on.mock.calls[0][1]();
    await Promise.resolve();
    expect(handler.mock.calls[0][0].commandHandlers).toBe(commandHandlers);
  });

  it("does not require cleanup methods on partial client mocks", async () => {
    const client = { on: jest.fn() };
    const result = await setupEvents({
      client,
      eventsDir: "/events",
      fsLib: { readdirSync: () => ["ready.mjs"] },
      importFn: async () => ({ default: jest.fn() }),
    });
    result.cleanup();
    expect(client.on).toHaveBeenCalledWith("ready", expect.any(Function));

    const noCleanupClient = { on: jest.fn() };
    const noCleanup = await setupEvents({
      client: noCleanupClient,
      eventsDir: "/events",
      fsLib: { readdirSync: () => ["ready.mjs"] },
      importFn: async () => ({ default: jest.fn() }),
    });
    noCleanup.cleanup();
  });

  it("logs missing-client and handler errors", async () => {
    const log = logger();
    const imports = [
      async () => ({ default: jest.fn() }),
      async () => ({ default: jest.fn().mockRejectedValue(new Error("handler failed")) }),
    ];
    const fsLib = {
      readdirSync: () => ["missing-client.mjs", "bad-handler.mjs"],
    };
    const client = { on: jest.fn() };
    const result = await setupEvents({
      client,
      eventsDir: "/events",
      log,
      fsLib,
      importFn: () => imports.shift()(),
    });
    expect(result.loadedEvents).toEqual(["missing-client", "bad-handler"]);
    expect(log.error).not.toHaveBeenCalledWith(
      "Failed to load event missing-client:",
      expect.any(Error),
    );
    client.on.mock.calls[1][1]();
    for (let turn = 0; turn < 5; turn += 1) await Promise.resolve();
    expect(log.error).toHaveBeenCalledWith(
      "Event handler failed for bad-handler:",
      expect.any(Error),
    );
  });

  it("covers defaults and localization fallback", async () => {
    const result = await withSilentDefaultLog(() => setupEvents());
    expect(result.loadedEvents).toEqual([]);
    await setupEvents({
      log: logger(),
      eventsDir: ".",
      fsLib: { readdirSync: () => ["missing.mjs"] },
    });

    const missingClientLog = logger();
    await setupEvents({
      eventsDir: "/events",
      log: missingClientLog,
      fsLib: { readdirSync: () => ["ready.mjs"] },
      importFn: async () => ({ default: jest.fn() }),
    });
    expect(missingClientLog.error).toHaveBeenCalledWith(
      "Failed to load event ready:",
      expect.any(Error),
    );

    const client = { on: jest.fn() };
    const handler = jest.fn();
    await setupEvents({
      client,
      log: logger(),
      eventsDir: "/events",
      fsLib: { readdirSync: () => ["ready.mjs"] },
      importFn: async () => ({ default: handler }),
    });
    client.on.mock.calls[0][1]();
    await Promise.resolve();
    const msg = handler.mock.calls[0][0].msg;
    expect(msg("en-US", "key")).toBe("An error occurred.");
    expect(msg("en-US", "key", "fallback")).toBe("fallback");
  });
  it("removes listeners attached before setup fails", async () => {
    const off = jest.fn().mockImplementationOnce(() => {
      throw new Error("remove failed");
    });
    const attached = [];
    const on = jest.fn((eventName, listener) => {
      attached.push([eventName, listener]);
      if (attached.length === 2) {
        throw new Error("attach failed");
      }
    });
    const client = { on, off };
    const log = { error: jest.fn(), warn: jest.fn() };
    await expect(
      setupEvents({
        client,
        log,
        eventsDir: "/events",
        fsLib: { readdirSync: () => ["ready.mjs", "error.mjs"] },
        importFn: async () => ({ default: jest.fn() }),
      }),
    ).rejects.toThrow("attach failed");
    expect(off).toHaveBeenCalledTimes(2);
    expect(off).toHaveBeenCalledWith(...attached[1]);
    expect(log.error).toHaveBeenCalledWith(
      "Failed to clean up event listeners:",
      expect.any(Error),
    );
  });
});
