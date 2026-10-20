import { jest } from "@jest/globals";
import { shutdownDiscord } from "../src/shutdown.mjs";
import * as api from "../src/index.mjs";

describe("shutdownDiscord", () => {
  it("keeps the shutdown coordinator out of the public package API", () => {
    expect(api.shutdownDiscord).toBeUndefined();
  });

  it("shares the shutdown promise and cleans all state once", async () => {
    let finishDestroy;
    const client = { destroy: jest.fn().mockResolvedValue(undefined) };
    client.destroy.mockImplementation(() => new Promise((resolve) => (finishDestroy = resolve)));
    const cleanupEvents = jest.fn();
    const clearLocalesFn = jest.fn();
    const removeSignal = jest.fn();
    const removeProcess = jest.fn();
    const options = {
      cleanupEvents,
      clearLocalesFn,
      signalRegistration: { removeHandlers: removeSignal },
      processHandlerRegistration: { removeHandlers: removeProcess },
    };
    const first = shutdownDiscord(client, options);
    const second = shutdownDiscord(client, options);
    expect(second).toBe(first);
    await Promise.resolve();
    expect(client.destroy).toHaveBeenCalledTimes(1);
    finishDestroy();
    await Promise.all([first, second]);
    await shutdownDiscord(client, options);
    expect(cleanupEvents).toHaveBeenCalledTimes(1);
    expect(clearLocalesFn).toHaveBeenCalledTimes(1);
    expect(removeSignal).toHaveBeenCalledTimes(1);
    expect(removeProcess).toHaveBeenCalledTimes(1);
    expect(client.destroy).toHaveBeenCalledTimes(1);
  });

  it("handles empty clients and clients without a destroy method", async () => {
    await expect(shutdownDiscord()).resolves.toBeUndefined();
    await expect(shutdownDiscord({})).resolves.toBeUndefined();
  });

  it("runs later cleanup when event cleanup throws", async () => {
    const clearLocalesFn = jest.fn();
    const client = { destroy: jest.fn().mockResolvedValue(undefined) };
    await expect(
      shutdownDiscord(client, {
        cleanupEvents: () => {
          throw new Error("cleanup");
        },
        clearLocalesFn,
      }),
    ).rejects.toThrow("cleanup");
    expect(clearLocalesFn).toHaveBeenCalledTimes(1);
    expect(client.destroy).toHaveBeenCalledTimes(1);
  });
});
