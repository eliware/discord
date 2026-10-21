export const reportLocaleFileFailure = ({ file, error, log }) =>
  log.error(`Failed to load or parse locale file ${file}:`, error);
