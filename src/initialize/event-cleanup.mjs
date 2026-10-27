import { createEventCleanup } from "../event/cleanup-snapshot.mjs";

export const setupEventCleanup = async ({ client, setupEventsFn, eventOptions }) => {
  const fallbackCleanup = createEventCleanup(client);
  try {
    const eventResult = await setupEventsFn(eventOptions);
    return {
      eventResult,
      cleanupEvents:
        typeof eventResult?.cleanup === "function" ? eventResult.cleanup : fallbackCleanup,
    };
  } catch (error) {
    fallbackCleanup();
    throw error;
  }
};
