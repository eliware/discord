import { resolvePurgeConfig } from "../../../src/command/purge/environment.mjs";

it("uses the environment guild when no guild is supplied", () => {
  expect(resolvePurgeConfig({}, { DISCORD_GUILD_ID: "environment-guild" }).guildId).toBe(
    "environment-guild",
  );
});

it("uses process credentials by default", () => {
  const oldId = process.env.DISCORD_CLIENT_ID;
  const oldToken = process.env.DISCORD_TOKEN;
  const oldGuildId = process.env.DISCORD_GUILD_ID;
  process.env.DISCORD_CLIENT_ID = "process-client";
  process.env.DISCORD_TOKEN = "process-token";
  process.env.DISCORD_GUILD_ID = "process-guild";
  try {
    expect(resolvePurgeConfig()).toEqual({
      clientId: "process-client",
      token: "process-token",
      guildId: "process-guild",
    });
  } finally {
    if (oldId === undefined) delete process.env.DISCORD_CLIENT_ID;
    else process.env.DISCORD_CLIENT_ID = oldId;
    if (oldToken === undefined) delete process.env.DISCORD_TOKEN;
    else process.env.DISCORD_TOKEN = oldToken;
    if (oldGuildId === undefined) delete process.env.DISCORD_GUILD_ID;
    else process.env.DISCORD_GUILD_ID = oldGuildId;
  }
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
