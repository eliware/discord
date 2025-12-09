# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/discord [![npm version](https://img.shields.io/npm/v/@eliware/discord.svg)](https://www.npmjs.com/package/@eliware/discord)[![license](https://img.shields.io/github/license/eliware/discord.svg)](LICENSE)[![build status](https://github.com/eliware/discord/actions/workflows/nodejs.yml/badge.svg)](https://github.com/eliware/discord/actions)

> A modular, extensible Discord app framework for Node.js, with built-in support for slash commands, localization, and event-driven architecture.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [ESM Example](#esm-example)
  - [CommonJS Example](#commonjs-example)
- [API](#api)
- [TypeScript](#typescript)
- [Support](#support)
- [License](#license)
- [Links](#links)

## Features

- Simple, opinionated Discord app setup for Node.js
- Slash command registration and handler auto-loading
- Event handler auto-loading for all Discord Gateway events
- Built-in localization system with easy locale file management
- TypeScript type definitions included
- Dependency injection and testability for all major components
- Logging and error handling hooks
- Extensible and modular directory structure

## Installation

```bash
npm install @eliware/discord
```

## Usage

### ESM Example

```js
import 'dotenv/config';
import log from '@eliware/log';
import path from '@eliware/path';
import { createDiscord } from '@eliware/discord';

try {
  await createDiscord({
    log,
    rootDir: path(import.meta),
    intents: { MessageContent: true }
  });
} catch (err) {
    log.error('Failed to start app:', err);
}
```

### CommonJS Example

```js
require('dotenv/config');
const log = require('@eliware/log').default;
const path = require('@eliware/path').default;
const { createDiscord } = require('@eliware/discord');

(async () => {
  try {
    await createDiscord({
      log,
      rootDir: path(__filename),
      intents: { MessageContent: true }
    });
  } catch (err) {
    log.error('Failed to start app:', err);
  }
})();
```

## API

### `createDiscord(options): Promise<Client>`

Creates and logs in a Discord client, auto-registers commands, loads event handlers, and sets up localization.

**Options:**

- `client_id` (string): Discord application client ID (required)
- `token` (string): Discord bot token (required)
- `log` (Logger): Logger instance (optional)
- `rootDir` (string): Root directory for events, commands, and locales (default: autodetect)
- `localesDir` (string): Directory for locale files (default: `<rootDir>/locales`)
- `commandsDir` (string): Directory for command definitions and handlers (default: `<rootDir>/commands`)
- `eventsDir` (string): Directory for event handlers (default: `<rootDir>/events`)
- `intents` (object): Discord Gateway Intents (default: Guilds and GuildMessages enabled)
- `partials` (array): Discord.js partials (default: `['MESSAGE', 'CHANNEL', 'REACTION']`)
- `clientOptions` (object): Additional Discord.js client options
- `ClientClass` (constructor): Custom Discord.js Client class (for testing)
- `setupEventsFn`, `setupCommandsFn`, `registerCommandsFn`, `setupLocalesFn`: Dependency injection for advanced use/testing
- `context` (object): Additional arbitrary data to be injected into all event and command handlers

Returns: A logged-in Discord.js `Client` instance.

### `splitMsg(msg, maxLength = 2000): string[]`

Splits a message into chunks of up to `maxLength` characters, attempting to split at newlines or periods for readability.

- `msg` (string): The message to split
- `maxLength` (number, optional): The maximum length of each chunk (default: 2000)
- **Returns:** An array of message chunks, each no longer than `maxLength`.

### Command and Event Structure

- **Commands:**  
  - Place `.json` files in the `commands/` directory for each command definition (see `commands/help.json` for structure).
  - Place a `.mjs` file with the same name for the command handler (see `commands/help.mjs`).
- **Events:**  
  - Place `.mjs` files in the `events/` directory, named after Discord Gateway events (e.g., `ready.mjs`, `messageCreate.mjs`).

### Localization

- Place locale files in the `locales/` directory (e.g., `en-US.json`, `es-ES.json`).
- Each file should be a flat key-value JSON object for that locale.

## TypeScript

Type definitions are included and cover all public APIs and options:

```ts
import type { CreateDiscordOptions } from '@eliware/discord';

declare function createDiscord(options?: CreateDiscordOptions): Promise<Client>;
```

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## License

[MIT © 2025 Eli Sterling, eliware.org](LICENSE)

## Links

- [Home Page](https://eliware.org)
- [GitHub (Module)](https://github.com/eliware/discord)
- [GitHub (Org)](https://github.com/eliware)
- [GitHub (Personal)](https://github.com/eli-sterling)
- [npm](https://www.npmjs.com/package/@eliware/discord)
- [Discord](https://discord.gg/M6aTR9eTwN)

---
