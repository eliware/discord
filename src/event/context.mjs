export const createEventContext = ({ context, client, log, msg, eventName, commandHandlers }) => {
  const handlerContext = { ...context, client, log, msg };
  if (eventName === "interactionCreate") handlerContext.commandHandlers = commandHandlers;
  return handlerContext;
};
