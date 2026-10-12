import { clearLocales } from "./locales.mjs";

const shutdownClients = new WeakSet();

export const shutdownDiscord = async (
  client,
  {
    cleanupEvents = () => {},
    clearLocalesFn = clearLocales,
    signalRegistration,
    processHandlerRegistration,
  } = {},
) => {
  if (!client || shutdownClients.has(client)) return;
  shutdownClients.add(client);
  try {
    cleanupEvents();
  } finally {
    try {
      clearLocalesFn();
    } finally {
      signalRegistration?.removeHandlers?.();
      processHandlerRegistration?.removeHandlers?.();
      if (typeof client.destroy === "function") await client.destroy();
    }
  }
};
