import { Client } from "discord.js";
import { createClientOptions } from "../client-options.mjs";

export const createDiscordClient = ({
  intents,
  partials,
  clientOptions,
  ClientClass = Client,
} = {}) => new ClientClass(createClientOptions(intents, partials, clientOptions));
