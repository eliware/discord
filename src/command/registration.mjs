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
    const rest = new restClass({ version: "10" }).setToken(token);
    await rest.put(routes.applicationCommands(clientId), { body: commandDefs });
    log.debug(`Discord accepted ${commandDefs.length} commands.`);
    return true;
  } catch (error) {
    const messages = {
      401: "Discord rejected the request (401). Check the token and client ID.",
      403: "Discord denied access (403). Check the bot permissions.",
    };
    const message = messages[error?.status];
    if (message) log.error(`Discord did not accept the commands: ${message}`);
    else log.error("Discord command request failed:", error?.message || error);
    return false;
  }
};
