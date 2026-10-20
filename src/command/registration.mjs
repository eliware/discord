import { log as logger } from "@eliware/log";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import { reportRegistrationError } from "./registration-error.mjs";

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
    const commandRoute = routes.applicationCommands(clientId);
    const existingCommands = await rest.get(commandRoute);
    for (const commandDef of commandDefs) {
      const existing = existingCommands.find(
        (command) =>
          command.name === commandDef.name && (command.type ?? 1) === (commandDef.type ?? 1),
      );
      if (existing) {
        await rest.put(routes.applicationCommand(clientId, existing.id), { body: commandDef });
      } else {
        await rest.post(commandRoute, { body: commandDef });
      }
    }
    log.debug(`Discord accepted ${commandDefs.length} commands.`);
    return true;
  } catch (error) {
    reportRegistrationError(log, error);
    return false;
  }
};
