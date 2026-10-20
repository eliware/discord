export const loginDiscordClient = async (client, token) => {
  try {
    return await client.login(token);
  } catch (error) {
    throw new Error(`Discord sign-in failed: ${error.message}`, { cause: error });
  }
};
