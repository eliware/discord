import { GatewayIntentBits, Partials } from "discord.js";
import { mapClientOptionMaps } from "../../../src/client/options/mapping.mjs";

describe("mapClientOptionMaps", () => {
  it("maps enabled names and includes default partials", () => {
    expect(mapClientOptionMaps({ Guilds: true }, { User: true, Message: false })).toEqual({
      intents: [GatewayIntentBits.Guilds],
      partials: [Partials.Channel, Partials.Reaction, Partials.User],
    });
  });
});
