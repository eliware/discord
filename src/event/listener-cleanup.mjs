/**
 * Remove attached event listeners and report the first removal error.
 * @param {Object} client Discord client.
 * @param {Array<[string, Function]>} listeners Attached event listeners.
 * @returns {void}
 */
export const cleanupEventListeners = (client, listeners) => {
  let cleanupError;
  for (const [eventName, listener] of listeners) {
    try {
      client.off?.(eventName, listener);
    } catch (error) {
      cleanupError ??= error;
    }
  }
  listeners.length = 0;
  if (cleanupError) throw cleanupError;
};
