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
    const result = createClientOptions({ Guilds: true }, { User: true, Message: false });

    expect(result.intents).toEqual([GatewayIntentBits.Guilds]);
    expect(result.partials).toEqual([Partials.Channel, Partials.Reaction, Partials.User]);
  });
});
