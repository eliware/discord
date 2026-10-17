# Configuration

Pass an options object to `createDiscord`. Set `clientId` and `token`, or set their environment values.
An option value overrides its environment value.

## Credentials

Set `DISCORD_CLIENT_ID` to the Discord application ID. Set `DISCORD_TOKEN` to the bot token.
Pass `clientId` or `token` to replace an environment value. Do not commit credentials.

Set optional `DISCORD_GUILD_ID` to select a guild for `purgeCommands`.
This value does not change the command request. The package sends commands to the global application route.

## Folders

Set `rootDir` to the app root. It defaults to the package root.
By default, the package reads `rootDir/commands`, `rootDir/events`, and `rootDir/locales`.
Set `commandsDir`, `eventsDir`, or `localesDir` to use a different folder.

## Client options

Set `intents` to an object of Discord gateway intent names and Boolean values.
All intents default to `false`. Enable only the intents required by the app.
Discord may require portal approval for privileged intents.

Set `partials` to an object of Discord data names and Boolean values.
`Message`, `Channel`, and `Reaction` default to `true`. Set every other entry to `false` by default.

Set `clientOptions` to supported Discord.js options.
These values are applied after the package sets intents and partials.
Use `clientOptions` to override generated client options.

Set `context` to a plain object for app values passed to each event handler.
Do not set `client`, `log`, `msg`, or `commandHandlers` in this object.

## Optional handlers

Set `signals: true` to add shutdown signal handlers. Set `processHandlers: true` to add process error handlers.
Both options default to `false`. The package removes these handlers during client shutdown.

Set `signalOptions` or `processHandlerOptions` to pass options to the matching Eliware package.
The Discord package supplies its logger and controls signal exit behavior.

## Custom functions

Set `setupLocalesFn`, `setupCommandsFn`, `setupEventsFn`, or `registerCommandsFn` to replace a setup step.
Use these options for tests or custom app loading. Each function must return the documented result shape.
Read the [API guide](api.md) for result fields.
