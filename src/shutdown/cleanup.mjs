import { cleanupShutdownClient } from "./client-cleanup.mjs";
import { cleanupShutdownLocales } from "./locale-cleanup.mjs";

export const cleanupDiscordState = async (
  client,
  { cleanupEvents, clearLocalesFn, signalRegistration, processHandlerRegistration },
) => {
  try {
    cleanupEvents();
  } finally {
    try {
      cleanupShutdownLocales(clearLocalesFn);
    } finally {
      await cleanupShutdownClient(client, { signalRegistration, processHandlerRegistration });
    }
  }
};
