import { registerSignalHandlers } from "./handler/signal-registration.mjs";
import { registerProcessHandlers } from "./handler/process-registration.mjs";

export const registerOptionalHandlers = ({
  signals,
  signalOptions,
  processHandlers,
  processHandlerOptions,
  log,
  cleanup,
  registrations,
}) => {
  if (signals)
    registrations.signalRegistration = registerSignalHandlers({ signalOptions, log, cleanup });
  if (processHandlers) {
    try {
      registrations.processHandlerRegistration = registerProcessHandlers({
        processHandlerOptions,
        log,
      });
    } catch (error) {
      if (typeof error?.registration?.removeHandlers === "function") {
        registrations.processHandlerRegistration = error.registration;
      }
      throw error;
    }
  }
};
