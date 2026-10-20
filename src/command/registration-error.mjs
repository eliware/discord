/** Report a Discord command registration error. */
export const reportRegistrationError = (log, error) => {
  const messages = {
    401: "Discord rejected the request (401). Check the token and client ID.",
    403: "Discord denied access (403). Check the bot permissions.",
  };
  const message = messages[error?.status];
  if (message) log.error(`Discord did not accept the commands: ${message}`);
  else log.error("Discord command request failed:", error?.message || error);
};
