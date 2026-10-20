import { jest } from "@jest/globals";
import { cleanupEventListeners } from "../../src/event/listener-cleanup.mjs";

describe("cleanupEventListeners", () => {
  it("removes listeners and clears the listener list", () => {
    const client = { off: jest.fn() };
    const listener = jest.fn();
    const listeners = [["ready", listener]];
    cleanupEventListeners(client, listeners);
    expect(client.off).toHaveBeenCalledWith("ready", listener);
    expect(listeners).toEqual([]);
  });

  it("supports clients without a cleanup method", () => {
    const listeners = [["ready", jest.fn()]];
    expect(() => cleanupEventListeners({}, listeners)).not.toThrow();
    expect(listeners).toEqual([]);
  });

  it("removes all listeners and throws the first removal error", () => {
    const firstError = new Error("remove failed");
    const client = {
      off: jest.fn().mockImplementationOnce(() => {
        throw firstError;
      }),
    };
    const listeners = [
      ["ready", jest.fn()],
      ["error", jest.fn()],
    ];
    expect(() => cleanupEventListeners(client, listeners)).toThrow(firstError);
    expect(client.off).toHaveBeenCalledTimes(2);
    expect(listeners).toEqual([]);
  });
});
