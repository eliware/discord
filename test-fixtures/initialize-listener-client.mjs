export function createListenerClient(jest, initialListeners = new Map(), removeMethod = "off") {
  const listeners = initialListeners;
  const remove = jest.fn((name, listener) => {
    listeners.set(
      name,
      listeners.get(name).filter((item) => item !== listener),
    );
  });
  const client = {
    eventNames: () => [...listeners.keys()],
    listeners: (name) => listeners.get(name) ?? [],
    on: jest.fn((name, listener) =>
      listeners.set(name, [...(listeners.get(name) ?? []), listener]),
    ),
    [removeMethod]: remove,
  };
  return { client, listeners, remove };
}
