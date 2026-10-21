# Migrate to version 15.0.0

Use this guide to update an app from an earlier `@eliware/discord` release.

## Install the package

Run this command in the app folder:

```sh
npm install @eliware/discord@15.0.0
```

## Check the runtime

Use Node.js 26 or later with native ECMAScript modules.
Keep the existing public imports for `createDiscord`, `purgeCommands`, and `splitMsg`.

## Check the app setup

Set `DISCORD_CLIENT_ID` and `DISCORD_TOKEN` in the app environment.
The package does not read `.env` files. Load those values in the app before calling `createDiscord`.

The package reads `commands`, `events`, and `locales` folders from the app root by default.
Pass `rootDir`, `commandsDir`, `eventsDir`, or `localesDir` when the app uses other folders.

## Check the logger

If the app passes a custom `log` value, make sure that the logger has a `child()` method.
Make sure that `child()` returns a logger.
The default `@eliware/log` logger meets this requirement.

## Check the bot setup

Invite each bot with the `bot` and `applications.commands` OAuth scopes.
Enable privileged intents in the Discord Developer Portal when the app needs them.

## Check command removal

Set `guildId` or `DISCORD_GUILD_ID` to remove commands from one guild.
Omit the guild ID to remove global commands.
The library does not remove commands automatically.

## Check shutdown

Call and await `client.shutdown()` to stop a client.
Do not call `client.destroy()` directly because it skips library cleanup.

When the app owns other services, stop them in their required order before you call `client.shutdown()`.
Read the [lifecycle guide](lifecycle.md) for shutdown details.

## Check examples

Read the [basic example guide](../examples/README.md) to set up and run a test bot.
