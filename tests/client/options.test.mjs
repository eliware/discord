import { GatewayIntentBits, Partials } from "discord.js";
import { createClientOptions } from "../../src/client/options.mjs";

describe("createClientOptions", () => {
  it("keeps intents off and uses default partials", () => {
    expect(createClientOptions(undefined, undefined)).toEqual({
      intents: [],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
  });

  it("adds app options to the normalized client options", () => {
    expect(
      createClientOptions({ Guilds: true }, { User: true, Message: false }, { app: true }),
    ).toEqual({
      intents: [GatewayIntentBits.Guilds],
      partials: [Partials.Channel, Partials.Reaction, Partials.User],
      app: true,
    });
  });
});
