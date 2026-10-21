import { getShutdownPromise } from "./shutdown/promise.mjs";
import { cleanupDiscordState } from "./shutdown/cleanup.mjs";

export const shutdownDiscord = (client, options = {}) => {
  if (!client) return Promise.resolve();
  const { cleanupEvents = () => {}, clearLocalesFn, registrations } = options;
  return getShutdownPromise(client, () =>
    Promise.resolve().then(() =>
      cleanupDiscordState(client, {
        cleanupEvents,
        clearLocalesFn,
        ...(registrations ?? options),
      }),
    ),
  );
};
