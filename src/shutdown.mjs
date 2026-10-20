import { cleanupShutdownClient } from "./shutdown/client-cleanup.mjs";
import { cleanupShutdownLocales } from "./shutdown/locale-cleanup.mjs";
import { getShutdownPromise } from "./shutdown/promise.mjs";

export const shutdownDiscord = (
  client,
  { cleanupEvents = () => {}, clearLocalesFn, signalRegistration, processHandlerRegistration } = {},
) => {
  if (!client) return Promise.resolve();
  return getShutdownPromise(client, () =>
    Promise.resolve().then(() =>
      shutdownClient(client, {
        cleanupEvents,
        clearLocalesFn,
        signalRegistration,
        processHandlerRegistration,
      }),
    ),
  );
};

const shutdownClient = async (
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
