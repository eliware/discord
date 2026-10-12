import { log as logger } from "@eliware/log";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";

export const registerCommands = async ({
  commandDefs,
  clientId = process.env.DISCORD_CLIENT_ID,
  token = process.env.DISCORD_TOKEN,
  log = logger,
  restClass = REST,
  routes = Routes,
}) => {
  if (!token) {
    log.warn("DISCORD_TOKEN is not set. Skipping command registration.");
    return false;
  }
  if (!clientId) {
    log.warn("DISCORD_CLIENT_ID is not set. Skipping command registration.");
    return false;
  }
  if (!commandDefs.length) {
    log.warn("No commands to register.");
    return false;
  }
  try {
    const rest = new restClass({ version: "10" }).setToken(token);
    await rest.put(routes.applicationCommands(clientId), { body: commandDefs });
    log.debug(`Registered ${commandDefs.length} commands successfully.`);
    return true;
  } catch (error) {
    const messages = {
      401: "Unauthorized (401). Please check your Discord token and client ID.",
      403: "Forbidden (403). The bot may lack permissions.",
    };
    const message = messages[error?.status];
    if (message) log.error(`Failed to register commands: ${message}`);
    else log.error("Failed to register commands:", error?.message || error);
    return false;
  }
};

export const purgeCommands = async ({
  clientId = process.env.DISCORD_CLIENT_ID,
  token = process.env.DISCORD_TOKEN,
  guildId = process.env.DISCORD_GUILD_ID || null,
  log = logger,
  restClass = REST,
  routes = Routes,
} = {}) => {
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
