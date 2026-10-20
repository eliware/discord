import { cleanupShutdownHandlers } from "./handler-cleanup.mjs";

export const cleanupShutdownClient = async (
  client,
  { signalRegistration, processHandlerRegistration },
) => {
  cleanupShutdownHandlers({ signalRegistration, processHandlerRegistration });
  if (typeof client.destroy === "function") await client.destroy();
};
