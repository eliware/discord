export const resolveRegistrationConfig = ({ clientId, token } = {}, environment = process.env) => ({
  clientId: clientId === undefined ? environment.DISCORD_CLIENT_ID : clientId,
  token: token === undefined ? environment.DISCORD_TOKEN : token,
});
