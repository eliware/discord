import { removeSignalHandlers } from "./signal-handler-removal.mjs";
import { removeProcessHandlers } from "./process-handler-removal.mjs";

export const cleanupShutdownClient = async (
  client,
  { signalRegistration, processHandlerRegistration },
) => {
  removeSignalHandlers(signalRegistration);
  removeProcessHandlers(processHandlerRegistration);
  if (typeof client.destroy === "function") await client.destroy();
};
