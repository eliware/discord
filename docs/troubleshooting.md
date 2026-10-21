# Troubleshooting

## Missing credentials

Set `DISCORD_CLIENT_ID` and `DISCORD_TOKEN` in the process environment.
You can also pass `clientId` and `token` to `createDiscord`.
Omit quotation marks unless they belong to the credential value.
The package does not read `.env` files. Load them in the app before you call `createDiscord`.

When Discord is optional, set `enabled: false` to skip credential checks.
When Discord is enabled, missing credentials stop startup.

## Logger setup fails

If the app passes `log`, provide a logger with a `child()` method.
Make sure `child()` returns a logger.
Use the default logger when custom logger settings are not necessary.

## Client login fails

Check that the token belongs to the bot and remains valid.
Check network access to Discord.
Read the `cause` field on the login error for the Discord.js error.

## An intent error occurs

Enable the intent that Discord requires in the Discord Developer Portal.
Set that intent to `true` in the `intents` option.
Discord may require approval for privileged intents.

## A command does not appear

Check that each command JSON file has a valid `name` and `description`.
Check that a matching `.mjs` file has a default function.
Check that the application ID belongs to the bot token.
Global commands may require time to appear in Discord.

Each startup updates matching commands and creates new commands one at a time.
The package keeps commands that the app does not provide.
The package also keeps remote commands after the app removes their local definitions or handlers.
Use `purgeCommands` to delete commands on the selected route.
Set `guildId` or `DISCORD_GUILD_ID` to select one guild route.
Omit the guild ID to select the global application route.

## An event does not run

Check that the event file ends in `.mjs`.
Use the Discord event name as the file name.
Export a default function from the file.
Check the logs for import or handler errors.

## A locale message uses its default text

Check that the file name matches the locale name.
Use a flat JSON object with string values.
Check that the requested key exists.
Set a default value in the `msg` call when the key is missing.

## A cleanup step fails

Call and await `client.shutdown()` from the app cleanup path.
Check the error from each app cleanup function.
Read the [lifecycle guide](lifecycle.md) for shutdown order.
