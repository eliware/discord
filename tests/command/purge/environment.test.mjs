import { resolvePurgeConfig } from "../../../src/command/purge/environment.mjs";
import { withEnvironment } from "../../../test-fixtures/environment.mjs";

it("uses the environment guild when no guild is supplied", () => {
  expect(resolvePurgeConfig({}, { DISCORD_GUILD_ID: "environment-guild" }).guildId).toBe(
    "environment-guild",
  );
});

it("uses process credentials by default", async () => {
  await withEnvironment(
    {
      DISCORD_CLIENT_ID: "process-client",
      DISCORD_TOKEN: "process-token",
      DISCORD_GUILD_ID: "process-guild",
    },
    async () => {
      expect(resolvePurgeConfig()).toEqual({
        clientId: "process-client",
        token: "process-token",
        guildId: "process-guild",
      });
    },
  );
});

it("uses a null guild when the environment has no guild", () => {
  expect(resolvePurgeConfig({}, {}).guildId).toBeNull();
});

it("keeps explicitly supplied values", () => {
  expect(
    resolvePurgeConfig(
      { clientId: "explicit-client", token: "explicit-token", guildId: "explicit-guild" },
      {
        DISCORD_CLIENT_ID: "environment-client",
        DISCORD_TOKEN: "environment-token",
        DISCORD_GUILD_ID: "environment-guild",
      },
    ),
  ).toEqual({
    clientId: "explicit-client",
    token: "explicit-token",
    guildId: "explicit-guild",
  });
});
