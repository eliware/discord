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

Create Discord.js clients and load app commands, events, and locale files.

## Requirements

Use Node.js 26 or later and native ESM.

## Setup

Install the package with `npm install @eliware/discord`.
Set `DISCORD_CLIENT_ID` and `DISCORD_TOKEN` in the process environment.
The package does not read `.env` files.
Read [usage](docs/usage.md) to start a client.

## Usage

Import `createDiscord` from `@eliware/discord` and pass an options object.
Call and await `client.shutdown()` to stop a client.
When the app does not use Discord, set `enabled: false` and check the returned value.
Read the [docs index](docs/README.md) for user guides and the [release notes](RELEASE_NOTES.md) for changes.

## Development

Read [specifications](specs/README.md) before you change source or tests.

## Testing

Run `npm test` for aggregate validation.

## Troubleshooting

Read the [troubleshooting guide](docs/troubleshooting.md) for common problems.

## Security

Keep bot tokens out of source control.
Enable only the intents and permissions that the app needs.

## API

The package exports `createDiscord`, `purgeCommands`, and `splitMsg`.
Read the [API guide](docs/api.md).

## Packaging

The `files` field in `package.json` includes `src/`, `docs/`, `README.md`, `AGENTS.md`, `LICENSE`, `RELEASE_NOTES.md`, `examples/`, `specs/`, and `.env.example`.
Use numeric `MAJOR.MINOR.PATCH` versions and matching `v<version>` tags.
The npm workflow validates tagged releases and checks that each tag matches `package.json.version` before it publishes.
Run `npm run pack` to check package contents.
Follow the approved Eliware Operations release process.

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
