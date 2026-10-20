import { jest } from "@jest/globals";
import { attachEventHandler } from "../../src/event/attachment.mjs";

describe("attachEventHandler", () => {
  it("creates and attaches an event listener", async () => {
    const client = { on: jest.fn() };
    const handler = jest.fn();
    const listeners = [];
    const loadedEvents = [];
    await attachEventHandler({
      client,
      context: {},
      log: { error: jest.fn() },
      msg: jest.fn(),
      eventName: "ready",
      commandHandlers: {},
      handler,
      onHandlerError: jest.fn(),
      listeners,
      loadedEvents,
    });
    expect(client.on).toHaveBeenCalledWith("ready", expect.any(Function));
    expect(listeners).toEqual([["ready", client.on.mock.calls[0][1]]]);
    expect(loadedEvents).toEqual(["ready"]);
  });

  it("logs a missing client without adding an event", async () => {
    const log = { error: jest.fn() };
    const listeners = [];
    const loadedEvents = [];
    await attachEventHandler({ eventName: "ready", log, listeners, loadedEvents });
    expect(log.error).toHaveBeenCalledWith("Failed to load event ready:", expect.any(Error));
    expect(listeners).toEqual([]);
    expect(loadedEvents).toEqual([]);
  });

  it("marks attach errors so the setup coordinator can clean up", async () => {
    const error = new Error("attach failed");
    const listeners = [];
    await expect(
      attachEventHandler({
        client: {
          on: jest.fn(() => {
            throw error;
          }),
        },
        eventName: "ready",
        log: { error: jest.fn() },
        listeners,
        loadedEvents: [],
      }),
    ).rejects.toBe(error);
    expect(error.eventListenerAttach).toBe(true);
    expect(listeners).toHaveLength(1);
  });
});
