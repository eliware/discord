import { log as logger } from "@eliware/log";
import { resolvePurgeConfig } from "./environment.mjs";
import { hasPurgeCredentials } from "./validation.mjs";
import { sendPurgeRequest } from "./request.mjs";

export const runPurgeCoordinator = async ({ clientId, token, guildId, log = logger } = {}) => {
  ({ clientId, token, guildId } = resolvePurgeConfig({ clientId, token, guildId }));
  if (!hasPurgeCredentials({ clientId, token })) {
    log.error("DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in your environment.");
    throw new Error("Missing credentials");
  }
  await sendPurgeRequest({ clientId, token, guildId, log });
};
