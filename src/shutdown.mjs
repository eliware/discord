import { cleanupShutdownClient } from "./shutdown/client-cleanup.mjs";
import { cleanupShutdownLocales } from "./shutdown/locale-cleanup.mjs";

const shutdownPromises = new WeakMap();

export const shutdownDiscord = (
  client,
  { cleanupEvents = () => {}, clearLocalesFn, signalRegistration, processHandlerRegistration } = {},
) => {
  if (!client) return Promise.resolve();
  if (shutdownPromises.has(client)) return shutdownPromises.get(client);
  const shutdownPromise = Promise.resolve().then(() =>
    shutdownClient(client, {
      cleanupEvents,
      clearLocalesFn,
      signalRegistration,
      processHandlerRegistration,
    }),
  );
  shutdownPromises.set(client, shutdownPromise);
  return shutdownPromise;
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
