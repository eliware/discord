import { registerSignals } from "@eliware/signals";
import { createSignalCleanupHook } from "../signal-cleanup.mjs";

export const registerSignalHandlers = ({ signalOptions, log, cleanup }) =>
  registerSignals({
    ...signalOptions,
    log,
    exit: false,
    shutdownHook: createSignalCleanupHook(cleanup, signalOptions.shutdownHook),
  });
