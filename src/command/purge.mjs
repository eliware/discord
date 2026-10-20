import { log as logger } from "@eliware/log";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import { resolvePurgeGuildId } from "./purge-environment.mjs";

export const purgeCommands = async ({
  clientId = process.env.DISCORD_CLIENT_ID,
  token = process.env.DISCORD_TOKEN,
  guildId,
  log = logger,
  restClass = REST,
  routes = Routes,
} = {}) => {
  guildId = resolvePurgeGuildId(guildId);
  if (!token || !clientId) {
    log.error("DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in your environment.");
    throw new Error("Missing credentials");
  }
  const rest = new restClass({ version: "10" }).setToken(token);
  const route = guildId
    ? routes.applicationGuildCommands(clientId, guildId)
    : routes.applicationCommands(clientId);
  await rest.put(route, { body: [] });
  log.info(
    guildId
      ? `All application commands purged for guild ${guildId}.`
      : "All global application commands purged.",
  );
};
