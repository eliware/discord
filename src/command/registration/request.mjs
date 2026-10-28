import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";

export const createCommandRequest = ({ clientId, token, restClass = REST, routes = Routes }) => {
  const rest = new restClass({ version: "10" }).setToken(token);
  const commandRoute = routes.applicationCommands(clientId);
  return {
    getExistingCommands: () => rest.get(commandRoute),
    createCommand: (commandDef) => rest.post(commandRoute, { body: commandDef }),
    updateCommand: (commandId, commandDef) =>
      rest.patch(routes.applicationCommand(clientId, commandId), { body: commandDef }),
  };
};
