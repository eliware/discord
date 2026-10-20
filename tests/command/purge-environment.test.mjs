import { resolvePurgeGuildId } from "../../src/command/purge-environment.mjs";

it("uses the environment guild when no guild is supplied", () => {
  expect(resolvePurgeGuildId(undefined, { DISCORD_GUILD_ID: "environment-guild" })).toBe(
    "environment-guild",
  );
});

it("reads the process environment by default", () => {
  const oldGuildId = process.env.DISCORD_GUILD_ID;
  process.env.DISCORD_GUILD_ID = "process-guild";
  try {
    expect(resolvePurgeGuildId()).toBe("process-guild");
  } finally {
    if (oldGuildId === undefined) delete process.env.DISCORD_GUILD_ID;
    else process.env.DISCORD_GUILD_ID = oldGuildId;
  }
});

it("uses a null guild when the environment has no guild", () => {
  expect(resolvePurgeGuildId(undefined, {})).toBeNull();
});

it("keeps an explicitly supplied guild", () => {
  expect(resolvePurgeGuildId("explicit-guild", { DISCORD_GUILD_ID: "environment-guild" })).toBe(
    "explicit-guild",
  );
});
