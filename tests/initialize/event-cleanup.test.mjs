import { jest } from "@jest/globals";
import { createListenerClient } from "../../test-fixtures/initialize-listener-client.mjs";
import { setupEventCleanup } from "../../src/initialize/event-cleanup.mjs";

it("returns event setup output and its cleanup function", async () => {
  const client = {};
  const eventOptions = { client, eventsDir: "events" };
  const cleanup = jest.fn();
  const setupEventsFn = jest.fn().mockResolvedValue({ loadedEvents: ["ready"], cleanup });

  const result = await setupEventCleanup({ client, setupEventsFn, eventOptions });

  expect(setupEventsFn).toHaveBeenCalledWith(eventOptions);
  expect(result).toEqual({
    eventResult: { loadedEvents: ["ready"], cleanup },
    cleanupEvents: cleanup,
  });
});

it("uses the fallback cleanup when setup does not return one", async () => {
  const { client, listeners, remove } = createListenerClient(jest);
  const addedListener = jest.fn();
  const result = await setupEventCleanup({
    client,
    setupEventsFn: async () => {
      client.on("ready", addedListener);
      return { loadedEvents: ["ready"] };
    },
    eventOptions: {},
  });

  result.cleanupEvents();

  expect(remove).toHaveBeenCalledWith("ready", addedListener);
  expect(listeners.get("ready")).toEqual([]);
});

it("runs fallback cleanup when event setup throws", async () => {
  const { client, listeners, remove } = createListenerClient(jest);
  const addedListener = jest.fn();
  await expect(
    setupEventCleanup({
      client,
      setupEventsFn: async () => {
        client.on("ready", addedListener);
        throw new Error("setup failed");
      },
      eventOptions: {},
    }),
  ).rejects.toThrow("setup failed");

  expect(remove).toHaveBeenCalledWith("ready", addedListener);
  expect(listeners.get("ready")).toEqual([]);
});
