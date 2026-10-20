# Usage

## Requirements

Use Node.js 26 or newer. Create a Discord application and bot in the Discord Developer Portal.
Add the bot to each server where you want to use it. Grant only the permissions it needs.

## Install

Install the package in your application:

```sh
npm install @eliware/discord
```

Use native ECMAScript modules. Set `DISCORD_CLIENT_ID` and `DISCORD_TOKEN` in the process environment.
You can also pass these values to `createDiscord`. The package does not read `.env` files.

## Start a client

Create an application entry file in the app root. This example enables the `Guilds` intent:

```js
import { createDiscord } from "@eliware/discord";

const client = await createDiscord({
  intents: { Guilds: true },
});

console.log(`Connected as ${client.user.tag}`);
```

Run the entry file from the app root. `createDiscord` reads app files from the current working
directory, then logs in to Discord.
Read [configuration](configuration.md) to set options and folder paths.

When Discord is optional, set `enabled` from the app configuration and check the result:

```js
const client = await createDiscord({ enabled: config.discordEnabled });
if (client) console.log(`Connected as ${client.user.tag}`);
```

When `enabled` is false, the function returns `null` before it checks credentials or starts setup.
When Discord is enabled, set valid credentials. Missing credentials cause startup to fail.

## Add app files

Create `commands/`, `events/`, `locales/`, and `src/` folders in the app root.
Store command definitions and adapters in `commands/`. Store event adapters in `events/`.
Keep command and event logic in focused modules under `src/commands/` and `src/events/`.
Store locale maps in `locales/`.
Read the [command](commands.md), [event](events.md), and [locale](localization.md) guides.

## Stop the client

Call and await `client.shutdown()` when the app must stop:

```js
await client.shutdown();
```

The method removes event listeners, clears loaded locales, removes optional handlers, and destroys the client.
Read the [lifecycle guide](lifecycle.md) for signal handling and cleanup details.
