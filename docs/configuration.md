# Configuration

Pass an options object to `createDiscord`. Set `clientId` and `token`, or set their environment values.
An option value takes priority over its environment value.

## Credentials

Set `DISCORD_CLIENT_ID` to the Discord application ID. Set `DISCORD_TOKEN` to the bot token.
Pass `clientId` or `token` to override an environment value. Do not commit real credentials.

Set optional `DISCORD_GUILD_ID` to select a guild for `purgeCommands`.
This value does not change normal command registration, which uses the global application route.

## Folders

Set `rootDir` to the app root. It defaults to the package root.
By default, the package reads `rootDir/commands`, `rootDir/events`, and `rootDir/locales`.
Set `commandsDir`, `eventsDir`, or `localesDir` to use another folder.

## Client options

Set `intents` to an object of Discord gateway intent names and Boolean values.
All intents default to `false`. Enable only the intents that the app needs.
Discord may require portal approval for privileged intents.

Set `partials` to an object of partial names and Boolean values.
`Message`, `Channel`, and `Reaction` default to `true`. All other partials default to `false`.

Set `clientOptions` to any supported Discord.js client options.
These values are applied after the package sets intents and partials.
Use `clientOptions` only when you need to override the generated client options.

Set `context` to a plain object for app values passed to each event handler.
Do not set `client`, `log`, `msg`, or `commandHandlers` in this object.

## Optional handlers

Set `signals: true` to register shutdown signal handlers. Set `processHandlers: true` to register process error handlers.
Both options default to `false`. The package removes these handlers during client shutdown.

Set `signalOptions` or `processHandlerOptions` to pass options to the matching Eliware package.
The Discord package supplies its logger and controls signal exit behavior.

## Custom functions

Set `setupLocalesFn`, `setupCommandsFn`, `setupEventsFn`, or `registerCommandsFn` to replace a setup step.
Use these options for tests or custom app loading. Each function must return the documented result shape.
Read the [API guide](api.md) for result fields.
