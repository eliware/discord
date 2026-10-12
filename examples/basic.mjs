import { createDiscord } from "@eliware/discord";

const client = await createDiscord({
  intents: { Guilds: true },
});

console.log(`Connected as ${client.user.tag}`);
process.once("SIGINT", async () => {
  await client.shutdown();
});
