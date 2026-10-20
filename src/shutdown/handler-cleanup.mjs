import { removeSignalHandlers } from "./signal-handler-removal.mjs";
import { removeProcessHandlers } from "./process-handler-removal.mjs";

export const cleanupShutdownHandlers = ({ signalRegistration, processHandlerRegistration }) => {
  removeSignalHandlers(signalRegistration);
  removeProcessHandlers(processHandlerRegistration);
};
