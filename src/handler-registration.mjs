import { registerHandlers } from "@eliware/errors";
import { registerSignals } from "@eliware/signals";
import { createSignalCleanupHook } from "./signal-cleanup.mjs";

export const registerOptionalHandlers = ({
  signals,
  signalOptions,
  processHandlers,
  processHandlerOptions,
  log,
  cleanup,
  registrations,
}) => {
  if (signals) {
    registrations.signalRegistration = registerSignals({
      ...signalOptions,
      log,
      exit: false,
      shutdownHook: createSignalCleanupHook(cleanup, signalOptions.shutdownHook),
    });
  }
  if (processHandlers) {
    registrations.processHandlerRegistration = registerHandlers({ ...processHandlerOptions, log });
  }
};
