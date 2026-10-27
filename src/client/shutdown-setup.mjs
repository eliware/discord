import { shutdownDiscord } from "../shutdown.mjs";

export const setupClientShutdown = ({
  client,
  getCleanupEvents,
  clearLocalesFn,
  registrations,
  shutdown = shutdownDiscord,
}) => {
  const cleanup = () =>
    shutdown(client, {
      cleanupEvents: getCleanupEvents(),
      clearLocalesFn,
      registrations,
    });
  client.shutdown = cleanup;
  return cleanup;
};
