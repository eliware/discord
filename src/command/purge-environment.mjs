export const resolvePurgeGuildId = (guildId, environment = process.env) =>
  guildId === undefined ? environment.DISCORD_GUILD_ID || null : guildId;
