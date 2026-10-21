import { log as logger } from "@eliware/log";
import { reportRegistrationError } from "./registration-error.mjs";
import { resolveRegistrationConfig } from "./registration/environment.mjs";
import { createCommandRequest } from "./registration/request.mjs";
import { reconcileCommands } from "./registration/reconcile.mjs";

export const registerCommands = async (options = {}) => {
  const { commandDefs, log = logger, restClass, routes } = options;
  const { clientId, token } = resolveRegistrationConfig(options);
  if (!token) {
    log.warn("DISCORD_TOKEN is not set. Skip command setup.");
    return false;
  }
  if (!clientId) {
    log.warn("DISCORD_CLIENT_ID is not set. Skip command setup.");
    return false;
  }
  if (!commandDefs.length) {
    log.warn("No commands are available to send.");
    return false;
  }
  try {
    const request = createCommandRequest({ clientId, token, restClass, routes });
    const existingCommands = await request.getExistingCommands();
    await reconcileCommands({ commandDefs, existingCommands, request });
    log.debug(`Discord accepted ${commandDefs.length} commands.`);
    return true;
  } catch (error) {
    reportRegistrationError(log, error);
    return false;
  }
};
