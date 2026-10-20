export const resolvePurgeConfig = (
  { clientId, token, guildId } = {},
  environment = process.env,
) => ({
  clientId: clientId === undefined ? environment.DISCORD_CLIENT_ID : clientId,
  token: token === undefined ? environment.DISCORD_TOKEN : token,
  guildId: guildId === undefined ? environment.DISCORD_GUILD_ID || null : guildId,
});
