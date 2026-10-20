/** Create a signal callback that cleans up the client before a user callback runs. */
export const createSignalCleanupHook = (cleanup, userHook) => async (signal) => {
  await cleanup();
  await userHook?.(signal);
};
