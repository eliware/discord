import { jest } from "@jest/globals";
import { createEventListener } from "../src/event-listener.mjs";

describe("createEventListener", () => {
  it.each([
    [
      () => {
        throw new Error("sync failed");
      },
      "sync failed",
    ],
    [() => Promise.reject(new Error("async failed")), "async failed"],
  ])("reports handler failures", async (handler, message) => {
    const onHandlerError = jest.fn();
    const listener = createEventListener({
      client: {},
      context: {},
      log: {},
      msg: jest.fn(),
      eventName: "ready",
      commandHandlers: {},
      handler,
      onHandlerError,
    });
    listener();
    for (let turn = 0; turn < 5; turn += 1) await Promise.resolve();
    expect(onHandlerError).toHaveBeenCalledWith(new Error(message), "ready");
  });
});
