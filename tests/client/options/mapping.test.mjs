import { Partials } from "discord.js";
import { mapClientOptionMaps } from "../../../src/client/options/mapping.mjs";

describe("mapClientOptionMaps", () => {
  it("keeps defaults disabled by explicit false values and ignores unknown keys", () => {
    expect(
      mapClientOptionMaps({ UnknownIntent: true }, { User: false, UnknownPartial: true }),
    ).toEqual({
      intents: [],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
  });
});
