# Troubleshooting

## Missing credentials

Set `DISCORD_CLIENT_ID` and `DISCORD_TOKEN` in the process environment.
You can also pass `clientId` and `token` to `createDiscord`.
Omit quotation marks unless they belong to the credential value.

## Client login fails

Check that the token belongs to the bot and remains valid.
Check that the application ID matches the bot.
Check network access to Discord.
Read the `cause` field on the login error for the Discord.js error.

## An intent error occurs

Enable the intent that Discord requires in the Discord Developer Portal.
Set that intent to `true` in the `intents` option.
Discord may require approval for privileged intents.

## A command does not appear

Check that each command JSON file has a valid `name` and `description`.
Check that a matching `.mjs` file has a default function.
Check the application ID and bot token.
Global commands may require time to appear in Discord.

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

Call and await `client.shutdown()` once.
Check the error from each app cleanup function.
Read the [lifecycle guide](lifecycle.md) for shutdown order.
