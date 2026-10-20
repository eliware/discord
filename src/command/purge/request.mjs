import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";

export const sendPurgeRequest = async ({ clientId, token, guildId, log }) => {
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
