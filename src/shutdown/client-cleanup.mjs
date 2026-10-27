import { cleanupShutdownHandlers } from "./handler-cleanup.mjs";

export const cleanupShutdownClient = async (
  client,
  { signalRegistration, processHandlerRegistration },
) => {
  try {
    cleanupShutdownHandlers({ signalRegistration, processHandlerRegistration });
  } finally {
    if (typeof client.destroy === "function") await client.destroy();
  }
};
