# API

Import public functions from `@eliware/discord`.
The package exports TypeScript declarations from its package root.

## `createDiscord(options)`

Create a client and connect it to Discord.
Pass credentials, folder paths, intents, partials, app context, or optional handler settings.
Read [configuration](configuration.md) for option details.
Pass a logger that has a `child()` method and returns a logger when you set `log`.
The function returns a new Discord client with an added `shutdown()` method.

## `shutdownDiscord(client, options)`

Stop a client. The function calls its `destroy()` method when it exists.
Optional `cleanupEvents` and `clearLocalesFn` fields replace the default cleanup functions.
The function returns when the client value is missing or shutdown is complete.

## `purgeCommands(options)`

Delete all global application commands, or all commands for the selected guild.
Pass `clientId`, `token`, and optional `guildId`.
The function uses `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `DISCORD_GUILD_ID` when options are missing.
It rejects when credentials are missing or the Discord API request fails.
The package does not call this function automatically.

## `splitMsg(message, maxLength)`

Split a string into chunks. The default maximum length is 2,000 characters.
The function trims the input and each chunk.
When a new line fits, it splits at that line.
When no new line fits, it splits at a period.
When no line or period fits, it uses the maximum length.

It returns an empty array when the input is blank.
It rejects non-string input and invalid maximum lengths.

## Custom setup functions

Use setup functions only when the app must replace a package setup step.
The package passes the options in this table.

| Option               | Input                                                             | Required result                           |
| -------------------- | ----------------------------------------------------------------- | ----------------------------------------- |
| `setupLocalesFn`     | `localesDir`, `log`                                               | `msg`, `loadedLocales`                    |
| `setupCommandsFn`    | `commandsDir`, `log`                                              | `commandHandlers`, optional `commandDefs` |
| `setupEventsFn`      | `client`, `eventsDir`, `log`, `msg`, `commandHandlers`, `context` | `loadedEvents`, optional `cleanup`        |
| `registerCommandsFn` | `commandDefs`, `clientId`, `token`, `log`                         | `true` when registration succeeds         |

The package skips command registration when no command definitions exist.
A false result from `registerCommandsFn` makes startup fail.
The package calls an event cleanup function during shutdown and startup rollback.

## Types

The package exports `CreateDiscordOptions`, `DiscordClient`, `EventHandlerContext`, `CommandDefinition`, `CommandHandler`, and `PurgeCommandsOptions`.
Import these types from `@eliware/discord` in TypeScript files.
