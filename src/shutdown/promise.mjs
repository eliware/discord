const shutdownPromises = new WeakMap();

export const getShutdownPromise = (client, createPromise) => {
  if (shutdownPromises.has(client)) return shutdownPromises.get(client);
  const shutdownPromise = createPromise();
  shutdownPromises.set(client, shutdownPromise);
  return shutdownPromise;
};
