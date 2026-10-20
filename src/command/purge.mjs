import { log as logger } from "@eliware/log";
import { resolvePurgeConfig } from "./purge/environment.mjs";
import { hasPurgeCredentials } from "./purge/validation.mjs";
import { sendPurgeRequest } from "./purge/request.mjs";

export const purgeCommands = async ({ clientId, token, guildId, log = logger } = {}) => {
  ({ clientId, token, guildId } = resolvePurgeConfig({ clientId, token, guildId }));
  if (!hasPurgeCredentials({ clientId, token })) {
    log.error("DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in your environment.");
    throw new Error("Missing credentials");
  }
  await sendPurgeRequest({ clientId, token, guildId, log });
};
