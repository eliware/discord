import { createEventListener } from "../event-listener.mjs";
import { markEventListenerAttachError } from "./attach-error.mjs";

export const attachEventHandler = async ({
  client,
  context,
  log,
  msg,
  eventName,
  commandHandlers,
  handler,
  onHandlerError,
  listeners,
  loadedEvents,
}) => {
  try {
    if (!client) throw new Error("Discord client is undefined");
    const listener = createEventListener({
      client,
      context,
      log,
      msg,
      eventName,
      commandHandlers,
      handler,
      onHandlerError,
    });
    listeners.push([eventName, listener]);
    try {
      client.on(eventName, listener);
    } catch (error) {
      throw markEventListenerAttachError(error);
    }
    loadedEvents.push(eventName);
  } catch (error) {
    if (error?.eventListenerAttach) throw error;
    log.error(`Failed to load event ${eventName}:`, error);
  }
};
