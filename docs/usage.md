# Usage

## Requirements

Use Node.js 26 or newer with native ECMAScript modules. Create an application and bot in the
Discord Developer Portal. Invite the bot with the `bot` and `applications.commands` OAuth scopes.
Grant only the permissions that the app needs. Enable privileged intents in the portal when the app
needs them.

## Install

Install the package in your application:

```sh
npm install @eliware/discord
```

Set `DISCORD_CLIENT_ID` and `DISCORD_TOKEN` in the process environment. You can also pass these
values to `createDiscord`. The package does not read `.env` files. Load a dotenv file in the app
before it calls `createDiscord` if the app uses one.

## Start a client

Create an application entry file in the app root. This example enables the `Guilds` intent, which
supports guild command interactions:

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

Use this folder layout when the app uses commands, events, and locales:

```text
app/
  commands/
    ping.json
    ping.mjs
  events/
    interactionCreate.mjs
  locales/
    en-US.json
  src/
    commands/
      ping.mjs
    events/
      interactionCreate.mjs
  index.mjs
```

The JSON command definition and its `.mjs` adapter must use the same base name. Event adapter names
must match Discord event names. Each adapter can re-export app logic from `src/`.

When Discord is optional, set `enabled` from app configuration and check the result:

```js
const discordEnabled = process.env.DISCORD_ENABLED === "true";
const client = await createDiscord({ enabled: discordEnabled });
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
