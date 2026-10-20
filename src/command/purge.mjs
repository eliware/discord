import { log as logger } from "@eliware/log";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import { resolvePurgeConfig } from "./purge-environment.mjs";

export const purgeCommands = async ({ clientId, token, guildId, log = logger } = {}) => {
  ({ clientId, token, guildId } = resolvePurgeConfig({ clientId, token, guildId }));
  if (!token || !clientId) {
    log.error("DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in your environment.");
    throw new Error("Missing credentials");
  }
  const rest = new REST({ version: "10" }).setToken(token);
  const route = guildId
    ? Routes.applicationGuildCommands(clientId, guildId)
    : Routes.applicationCommands(clientId);
  await rest.put(route, { body: [] });
  log.info(
    guildId
      ? `All application commands purged for guild ${guildId}.`
      : "All global application commands purged.",
  );
};
