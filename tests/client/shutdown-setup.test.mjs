import { jest } from "@jest/globals";
import { setupClientShutdown } from "../../src/client/shutdown-setup.mjs";

it("attaches shutdown and reads current event cleanup when called", async () => {
  const client = {};
  const clearLocalesFn = jest.fn();
  const registrations = { signalRegistration: { removeHandlers: jest.fn() } };
  const shutdown = jest.fn().mockResolvedValue(undefined);
  let cleanupEvents = jest.fn();
  const setupEvents = setupClientShutdown({
    client,
    getCleanupEvents: () => cleanupEvents,
    clearLocalesFn,
    registrations,
    shutdown,
  });
  cleanupEvents = jest.fn();

  expect(client.shutdown).toBe(setupEvents);
  await client.shutdown();

  expect(shutdown).toHaveBeenCalledWith(client, {
    cleanupEvents,
    clearLocalesFn,
    registrations,
  });
});
