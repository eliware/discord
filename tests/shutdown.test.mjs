import { jest } from "@jest/globals";
import { shutdownDiscord } from "../src/shutdown.mjs";

describe("shutdownDiscord", () => {
  it("cleans all state once", async () => {
    const client = { destroy: jest.fn().mockResolvedValue(undefined) };
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
    await shutdownDiscord(client, options);
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

  it("reads optional handler registrations when cleanup starts", async () => {
    const client = { destroy: jest.fn().mockResolvedValue(undefined) };
    const removeSignal = jest.fn();
    const registrations = {};
    const shutdown = shutdownDiscord(client, { registrations });
    registrations.signalRegistration = { removeHandlers: removeSignal };

    await shutdown;

    expect(removeSignal).toHaveBeenCalledTimes(1);
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
