import { GatewayIntentBits, Partials } from "discord.js";
import { createClientOptions } from "../../src/client/options.mjs";

describe("createClientOptions", () => {
  it("keeps intents off and uses default partials", () => {
    expect(createClientOptions(undefined, undefined)).toEqual({
      intents: [],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
  });

  it("maps enabled intents and partials", () => {
    expect(
      createClientOptions({ Guilds: true }, { User: true, Message: false }, { app: true }),
    ).toEqual({
      intents: [GatewayIntentBits.Guilds],
      partials: [Partials.Channel, Partials.Reaction],
      app: true,
    });
  });

  it("rejects unknown intent and partial keys", () => {
    expect(() => createClientOptions({ Bad: true }, undefined)).toThrow("Unknown intents key");
    expect(() => createClientOptions(undefined, { Bad: true })).toThrow("Unknown partials key");
  });

  it("rejects non-boolean option values", () => {
    expect(() => createClientOptions({ Guilds: 1 }, undefined)).toThrow("must be a boolean");
    expect(() => createClientOptions(undefined, { User: "yes" })).toThrow("must be a boolean");
  });

  it("rejects array input for intents and partials", () => {
    expect(() => createClientOptions(["Guilds"], undefined)).toThrow(
      "intents must be an object of boolean values.",
    );
    expect(() => createClientOptions(undefined, ["User"])).toThrow(
      "partials must be an object of boolean values.",
    );
  });
});
