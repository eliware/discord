import { jest } from "@jest/globals";
import { cleanupDiscordState } from "../../src/shutdown/cleanup.mjs";

it("cleans event, locale, handler, and client state in order", async () => {
  const calls = [];
  const client = {
    destroy: jest.fn(async () => calls.push("destroy")),
  };
  const cleanupEvents = jest.fn(() => calls.push("events"));
  const clearLocalesFn = jest.fn(() => calls.push("locales"));
  const removeHandlers = jest.fn(() => calls.push("handlers"));

  await cleanupDiscordState(client, {
    cleanupEvents,
    clearLocalesFn,
    signalRegistration: { removeHandlers },
    processHandlerRegistration: undefined,
  });

  expect(calls).toEqual(["events", "locales", "handlers", "destroy"]);
});
