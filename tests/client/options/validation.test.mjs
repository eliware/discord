import { GatewayIntentBits, Partials } from "discord.js";
import { normalizeClientOptionMaps } from "../../../src/client/options/validation.mjs";

describe("normalizeClientOptionMaps", () => {
  it("maps enabled intent and partial names", () => {
    expect(normalizeClientOptionMaps({ Guilds: true }, { User: true, Message: false })).toEqual({
      intents: [GatewayIntentBits.Guilds],
      partials: [Partials.Channel, Partials.Reaction, Partials.User],
    });
  });

  it("rejects unknown intent and partial names", () => {
    expect(() => normalizeClientOptionMaps({ Bad: true }, undefined)).toThrow(
      "Unknown intents key",
    );
    expect(() => normalizeClientOptionMaps(undefined, { Bad: true })).toThrow(
      "Unknown partials key",
    );
  });

  it("rejects non-boolean and array option values", () => {
    expect(() => normalizeClientOptionMaps({ Guilds: 1 }, undefined)).toThrow("must be a boolean");
    expect(() => normalizeClientOptionMaps(undefined, { User: "yes" })).toThrow(
      "must be a boolean",
    );
    expect(() => normalizeClientOptionMaps(["Guilds"], undefined)).toThrow(
      "intents must be an object of boolean values.",
    );
    expect(() => normalizeClientOptionMaps(undefined, ["User"])).toThrow(
      "partials must be an object of boolean values.",
    );
  });
});
