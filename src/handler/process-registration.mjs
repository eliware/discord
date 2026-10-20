import { registerHandlers } from "@eliware/errors";

export const registerProcessHandlers = ({ processHandlerOptions, log }) =>
  registerHandlers({ ...processHandlerOptions, log });
