export const createEventListener =
  ({ client, context, log, msg, eventName, commandHandlers, handler, onHandlerError }) =>
  (...eventArgs) => {
    const handlerContext = { ...context, client, log, msg };
    if (eventName === "interactionCreate") handlerContext.commandHandlers = commandHandlers;
    Promise.resolve()
      .then(() => handler(handlerContext, ...eventArgs))
      .catch((error) => onHandlerError(error, eventName));
  };
