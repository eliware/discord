# Configuration

Pass an options object to `createDiscord`. Set `clientId` and `token`, or set their environment values.
An option value overrides its environment value.

Set `enabled: false` when Discord is optional for the app. The function returns `null` without
checking credentials, creating a client, loading app files, or adding handlers. Discord is enabled
by default. When Discord is enabled, the function requires both credentials.

## Credentials

Set `DISCORD_CLIENT_ID` to the Discord application ID. Set `DISCORD_TOKEN` to the bot token.
Pass `clientId` or `token` to replace an environment value. Do not commit credentials.

Set optional `DISCORD_GUILD_ID` to select a guild for `purgeCommands`.
This value does not change the command request. The package sends commands to the global application route.

## Folders

Set `rootDir` to the app root. It defaults to the current working directory.
By default, the package reads `rootDir/commands`, `rootDir/events`, and `rootDir/locales`.
Set `commandsDir`, `eventsDir`, or `localesDir` to use a different folder.

## Client options

Set `intents` to an object of Discord gateway intent names and Boolean values.
All intents default to `false`. Enable only the intents required by the app.
Discord may require portal approval for privileged intents.

Set `partials` to an object of Discord data names and Boolean values.
`Message`, `Channel`, and `Reaction` default to `true`. Other partials default to `false`.

Set `clientOptions` to supported Discord.js options.
These values are applied after the package sets intents and partials.
Use `clientOptions` to override generated client options.

Set `context` to a plain object for app values passed to each event handler.
Do not set `client`, `log`, `msg`, or `commandHandlers` in this object.

## Logger

The package uses the default `@eliware/log` logger when `log` is not set.
If you pass `log`, provide a logger with a `child()` method that returns a logger.

## Optional handlers

Set `signals: true` to add shutdown signal handlers. Set `processHandlers: true` to add process error handlers.
Both options default to `false`. The package removes these handlers during client shutdown.

Set `signalOptions` or `processHandlerOptions` to pass options to the matching Eliware package.
The Discord package supplies its logger and controls signal exit behavior.

## App setup

Keep command, event, and locale files in the app. Use the documented folders and file formats.
The package does not expose internal setup functions as consumer options.
