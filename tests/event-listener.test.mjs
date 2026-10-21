import { jest } from "@jest/globals";
import { createEventListener } from "../src/event-listener.mjs";

describe("createEventListener", () => {
  it("passes event arguments to a handler", async () => {
    const handler = jest.fn();
    const listener = createEventListener({
      client: {},
      context: { appValue: true },
      log: {},
      msg: jest.fn(),
      eventName: "ready",
      handler,
      onHandlerError: jest.fn(),
    });
    listener("event argument");
    await Promise.resolve();
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ appValue: true }),
      "event argument",
    );
  });

  it("reports handler errors", async () => {
    const error = new Error("handler failed");
    const onHandlerError = jest.fn();
    const listener = createEventListener({
      client: {},
      context: {},
      log: {},
      msg: jest.fn(),
      eventName: "ready",
      handler: jest.fn().mockRejectedValue(error),
      onHandlerError,
    });
    listener();
    for (let turn = 0; turn < 5; turn += 1) await Promise.resolve();
    expect(onHandlerError).toHaveBeenCalledWith(error, "ready");
  });
});
