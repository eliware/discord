# API

Import public functions from `@eliware/discord`.
The package exports TypeScript declarations from its package root.

## `createDiscord(options)`

Create, configure, and log in to a Discord.js client.
Pass credentials, folder paths, intents, partials, app context, or optional handler settings.
Read [configuration](configuration.md) for option details.
The function returns a Discord client with an added `shutdown()` method.

## `shutdownDiscord(client, options)`

Clean up a client, then destroy it when it has a `destroy` method.
Optional `cleanupEvents` and `clearLocalesFn` fields replace the default cleanup functions.
The function does nothing when the client is missing or already shut down.

## `purgeCommands(options)`

Delete all global application commands, or all commands for the selected guild.
Pass `clientId`, `token`, and optional `guildId`.
The function uses `DISCORD_CLIENT_ID`, `DISCORD_TOKEN`, and `DISCORD_GUILD_ID` when options are missing.
It rejects when credentials are missing or the Discord API request fails.
The package never calls this function automatically.

## `splitMsg(message, maxLength)`

Split a string into chunks. The default maximum length is 2,000 characters.
The function trims the input and each chunk.
It prefers a line break, then a period, then the maximum length.
It returns an empty array when the input contains only white space.
It rejects non-string input and invalid maximum lengths.

## Types

The package exports `CreateDiscordOptions`, `DiscordClient`, `EventHandlerContext`, `CommandDefinition`, and `CommandHandler`.
Import these types from `@eliware/discord` in TypeScript files.
