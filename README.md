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

- Create and stop a Discord.js client.
- Load app commands, events, and locale files.
- Register slash commands and optional process handlers.

## Requirements

Use Node.js 26 or newer. Use native ECMAScript modules.

## Setup

Install `@eliware/discord`. Set `DISCORD_CLIENT_ID` and `DISCORD_TOKEN` in the process environment.
Read [usage](docs/usage.md) to start a client.

## Usage

Import `createDiscord` from `@eliware/discord` and pass an options object.
Call `client.shutdown()` to stop the client.
Read the [docs index](docs/README.md), [usage](docs/usage.md), [configuration](docs/configuration.md), and [release notes](RELEASE_NOTES.md).

## Development

Use Node.js 26 and native ESM. Read [specifications](specs/README.md) and [examples](examples/README.md).

## Testing

Run `npm test` for repository validation.

## Troubleshooting

Read the [troubleshooting guide](docs/troubleshooting.md).

## Security

Keep bot tokens out of source control. Enable only the intents and permissions that the app needs.

## API

The package exports `createDiscord`, `shutdownDiscord`, `purgeCommands`, and `splitMsg`.
Read the [API guide](docs/api.md).

## Packaging

The npm package includes `src/`, `docs/`, `examples/`, and `specs/`.

## Examples

Read the [example index](examples/README.md).

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
