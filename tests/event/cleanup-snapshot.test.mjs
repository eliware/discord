import { jest } from "@jest/globals";
import { createEventCleanup } from "../../src/event/cleanup-snapshot.mjs";

describe("createEventCleanup", () => {
  it("removes listeners added after the snapshot and keeps existing listeners", () => {
    const existing = jest.fn();
    const added = jest.fn();
    const listeners = new Map([["ready", [existing]]]);
    const client = {
      eventNames: jest.fn(() => [...listeners.keys()]),
      listeners: jest.fn((name) => listeners.get(name) ?? []),
      off: jest.fn((name, listener) =>
        listeners.set(
          name,
          listeners.get(name).filter((item) => item !== listener),
        ),
      ),
    };
    const cleanup = createEventCleanup(client);
    listeners.set("ready", [existing, added]);
    listeners.set("custom", [jest.fn()]);

    cleanup();

    expect(client.off).toHaveBeenCalledWith("ready", added);
    expect(client.off).toHaveBeenCalledWith("custom", expect.any(Function));
    expect(listeners.get("ready")).toEqual([existing]);
  });

  it("returns a no-op when the client cannot list or remove listeners", () => {
    expect(() => createEventCleanup({})()).not.toThrow();
  });
});
