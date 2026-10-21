import { GatewayIntentBits, Partials } from "discord.js";
import { createClientOptions } from "../../../src/client/options/create.mjs";

describe("createClientOptions", () => {
  it("keeps intents off and uses default partials", () => {
    expect(createClientOptions(undefined, undefined)).toEqual({
      intents: [],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
  });

  it("normalizes enabled intents and partials", () => {
    expect(createClientOptions({ Guilds: true }, { User: true, Message: false })).toEqual({
      intents: [GatewayIntentBits.Guilds],
      partials: [Partials.Channel, Partials.Reaction, Partials.User],
    });
  });
});
