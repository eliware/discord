# API

Import the public functions from the package root:

```js
import { createDiscord, purgeCommands, splitMsg } from "@eliware/discord";
```

The package exports TypeScript declarations from the package root. It does not export setup helpers.

## `createDiscord(options)`

Create a Discord.js client, load app files, send command definitions, and log in.
The function returns a client with a `shutdown()` method.
It returns `null` when `enabled` is `false`.

| Option                  | Default                            | Purpose                                               |
| ----------------------- | ---------------------------------- | ----------------------------------------------------- |
| `enabled`               | `true`                             | Set `false` to skip Discord setup and return `null`.  |
| `clientId`              | `DISCORD_CLIENT_ID`                | Set the Discord application ID.                       |
| `token`                 | `DISCORD_TOKEN`                    | Set the bot token.                                    |
| `log`                   | `@eliware/log` logger              | Set a logger with a `child()` method.                 |
| `rootDir`               | `process.cwd()`                    | Set the app root folder.                              |
| `commandsDir`           | `rootDir/commands`                 | Set the command folder.                               |
| `eventsDir`             | `rootDir/events`                   | Set the event folder.                                 |
| `localesDir`            | `rootDir/locales`                  | Set the locale folder.                                |
| `intents`               | All disabled                       | Enable the required Discord gateway intents.          |
| `partials`              | Message, Channel, Reaction enabled | Enable incomplete Discord data objects.               |
| `context`               | `{}`                               | Pass app values to event and command handlers.        |
| `clientOptions`         | `{}`                               | Pass other Discord.js client options.                 |
| `signals`               | `false`                            | Add library signal handlers for Discord-only cleanup. |
| `signalOptions`         | `{}`                               | Pass options to `@eliware/signals`.                   |
| `processHandlers`       | `false`                            | Add process error handlers from `@eliware/errors`.    |
| `processHandlerOptions` | `{}`                               | Pass options to `@eliware/errors`.                    |

Set `clientId` and `token` in the options or process environment.
Set `clientId` to the Discord application ID.
The package does not read `.env` files.
When Discord is enabled, both credentials are required.
Read [configuration](configuration.md) for valid intent and data object names.

## `client.shutdown()`

Call and await this method to stop a client created by `createDiscord`.
It removes event listeners, clears loaded locales, removes optional handlers, and destroys the client.
Repeated calls share one promise and run cleanup once.

## `purgeCommands(options)`

Delete registered commands for an application.
Pass `clientId` and `token`, or set `DISCORD_CLIENT_ID` and `DISCORD_TOKEN`.
Set `guildId` or `DISCORD_GUILD_ID` to delete commands for one guild.
Omit `guildId` to delete global commands.
The function does not run automatically.
The promise rejects when credentials are missing or the Discord request fails.

```js
await purgeCommands({ clientId, token, guildId });
```

## `splitMsg(message, maxLength)`

Split a string into trimmed chunks with a default limit of 2,000 characters.
It uses the final newline before the limit, or the final period when no newline exists, and keeps that separator with its preceding chunk.
It splits at the limit when the selected separator is the first character.
Blank input returns an empty array.
It throws a `TypeError` for non-string input and a `RangeError` for an invalid limit.

## Types

The package exports `CreateDiscordOptions`, `DiscordClient`, `EventHandlerContext`,
`CommandDefinition`, `CommandHandler`, and `PurgeCommandsOptions`.
Import these types from `@eliware/discord` in TypeScript files.
