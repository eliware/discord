export const mergeClientOptions = (normalizedOptions, clientOptions = {}) => ({
  ...normalizedOptions,
  ...clientOptions,
});
