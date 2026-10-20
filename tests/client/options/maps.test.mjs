import { GatewayIntentBits, Partials } from "discord.js";
import {
  DEFAULT_INTENTS,
  DEFAULT_PARTIALS,
  INTENT_MAP,
  PARTIALS_MAP,
} from "../../../src/client/options/maps.mjs";

describe("client option maps", () => {
  it("maps Discord names to Discord.js values", () => {
    expect(INTENT_MAP.Guilds).toBe(GatewayIntentBits.Guilds);
    expect(PARTIALS_MAP.User).toBe(Partials.User);
  });

  it("sets all intents off and default partials on", () => {
    expect(Object.values(DEFAULT_INTENTS).every((enabled) => !enabled)).toBe(true);
    expect(DEFAULT_PARTIALS).toEqual({ Message: true, Channel: true, Reaction: true });
  });
});
