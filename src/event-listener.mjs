import { createEventContext } from "./event/context.mjs";

export const createEventListener =
  ({ client, context, log, msg, eventName, commandHandlers, handler, onHandlerError }) =>
  (...eventArgs) => {
    const handlerContext = createEventContext({
      context,
      client,
      log,
      msg,
      eventName,
      commandHandlers,
    });
    Promise.resolve()
      .then(() => handler(handlerContext, ...eventArgs))
      .catch((error) => onHandlerError(error, eventName));
  };
