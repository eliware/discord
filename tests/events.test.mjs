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
      fsLib: { readdirSync: jest.fn(() => ["ready.mjs"]) },
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

  it("uses default setup options", async () => {
    const result = await withSilentDefaultLog(() => setupEvents());
    expect(result.loadedEvents).toEqual([]);
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
