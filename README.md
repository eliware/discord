# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/discord [![npm](https://img.shields.io/npm/v/@eliware/discord)](https://www.npmjs.com/package/@eliware/discord) [![License](https://img.shields.io/github/license/eliware/discord)](https://github.com/eliware/discord/blob/main/LICENSE) [![CI](https://github.com/eliware/discord/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/discord/actions/workflows/ci.yaml)

A modular, extensible Discord app framework for Node.js with slash command, localization, and event-driven support.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [API](#api)
- [Packaging](#packaging)
- [Examples](#examples)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

- Create a Discord.js client with `createDiscord`.
- Load command, event, and locale files from the app folder.
- Register slash commands with Discord.
- Set gateway intents and partials.
- Add optional signal and process error handlers.
- Stop the client with `client.shutdown()`.

## Requirements

Use Node.js 26 or later. Create a Discord app and bot token before live use.
Enable only the gateway intents that the app needs.

## Setup

Install the package:

```bash
npm install @eliware/discord
```

Set `DISCORD_CLIENT_ID` and `DISCORD_TOKEN` in the process environment, or pass
`clientId` and `token` to `createDiscord`. This package does not read `.env` files.
`DISCORD_GUILD_ID` is optional. It sets the guild target for `purgeCommands`.
Use [`.env.example`](.env.example) as a template for these values.

## Usage

```js
import { createDiscord } from "@eliware/discord";

const client = await createDiscord({
  intents: { Guilds: true },
});

await client.shutdown();
```

The app can set `clientId`, `token`, or both in the options. The package uses the
environment values when an option is missing. The package reads app files from
`rootDir/commands`, `rootDir/events`, and `rootDir/locales` by default.

See the [usage guide](docs/usage.md), [docs index](docs/README.md), and
[release notes](RELEASE_NOTES.md).

## Development

Use Node.js 26 or later. Run `npm ci` before local work.

## Testing

Run `npm test` for all checks. Run `npm run typecheck` for TypeScript checks.
The tests use injected clients and loaders. They do not need a live Discord app.

## Troubleshooting

Check the [troubleshooting guide](docs/troubleshooting.md). Check the
[specification index](specs/README.md) for repository requirements.

## Security

Keep tokens in environment variables or secret storage. Do not log tokens or
private event data. Review intents and Discord permissions before live use.

## API

### `createDiscord(options)`

Create and log in to a Discord client. The function loads app files and registers
valid command definitions. It returns a client with an idempotent `shutdown()` method.

Options include `clientId`, `token`, `log`, `rootDir`, `localesDir`, `commandsDir`,
`eventsDir`, `intents`, `partials`, `clientOptions`, and `context`. The function also
accepts setup functions and a custom client class for tests.

`clientId` and `token` are optional when their environment values exist.
`rootDir` defaults to the package root. The three folder options default to
`rootDir/locales`, `rootDir/commands`, and `rootDir/events`.

All intents default to `false`. Partials default to `Message`, `Channel`, and
`Reaction`. Set `signals` or `processHandlers` to `true` to enable those handlers.
The `context` value must be a plain object. Do not set `client`, `log`, `msg`, or
`commandHandlers` in that object.

All gateway intents are disabled by default. Set each needed intent to `true`.
The Discord developer portal must allow privileged intents.

### `splitMsg(message, maxLength)`

Split a string into message chunks. Each chunk stays within `maxLength` characters.
The default limit is 2,000 characters.

### `purgeCommands(options)`

Delete all global commands or all commands for one guild. The function needs a
client ID and token. Set `guildId` or `DISCORD_GUILD_ID` to select a guild.
The package never calls it automatically.

## Packaging

The npm package includes `src/`, `docs/`, `examples/`, and `specs/`. It also
includes this README, the agent guide, the license, and release notes.

The package does not include app command, event, or locale files. The app owns
those files. The public package is [@eliware/discord on npm](https://www.npmjs.com/package/@eliware/discord).

## Examples

See the [example index](examples/README.md) for the runnable example and its
requirements.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/discord)
- [Bug Reports](https://github.com/eliware/discord/issues)
- [npm](https://www.npmjs.com/package/@eliware/discord)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
