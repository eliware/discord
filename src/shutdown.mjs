import { clearLocales } from "./locales.mjs";
import { removeSignalHandlers } from "./shutdown/signal-handler-removal.mjs";
import { removeProcessHandlers } from "./shutdown/process-handler-removal.mjs";

const shutdownPromises = new WeakMap();

export const shutdownDiscord = (
  client,
  {
    cleanupEvents = () => {},
    clearLocalesFn = clearLocales,
    signalRegistration,
    processHandlerRegistration,
  } = {},
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
      clearLocalesFn();
    } finally {
      removeSignalHandlers(signalRegistration);
      removeProcessHandlers(processHandlerRegistration);
      if (typeof client.destroy === "function") await client.destroy();
    }
  }
};
