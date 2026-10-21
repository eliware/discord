import { getShutdownPromise } from "./shutdown/promise.mjs";
import { cleanupDiscordState } from "./shutdown/cleanup.mjs";

export const shutdownDiscord = (
  client,
  { cleanupEvents = () => {}, clearLocalesFn, signalRegistration, processHandlerRegistration } = {},
) => {
  if (!client) return Promise.resolve();
  return getShutdownPromise(client, () =>
    Promise.resolve().then(() =>
      cleanupDiscordState(client, {
        cleanupEvents,
        clearLocalesFn,
        signalRegistration,
        processHandlerRegistration,
      }),
    ),
  );
};
