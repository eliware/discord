export const createEventCleanup = (client) => {
  if (
    typeof client?.eventNames !== "function" ||
    typeof client.listeners !== "function" ||
    typeof client.off !== "function"
  ) {
    return () => {};
  }
  const existing = new Map(client.eventNames().map((name) => [name, client.listeners(name)]));
  return () => {
    for (const name of client.eventNames()) {
      for (const listener of client.listeners(name)) {
        if (existing.get(name)?.includes(listener)) continue;
        client.off(name, listener);
      }
    }
  };
};
