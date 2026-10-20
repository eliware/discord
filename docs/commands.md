# Commands

Store slash command definitions and adapters in the app command folder.
Set `commandsDir` to use a custom folder.
Keep command behavior in a focused source module.

## Definition

Create `commands/ping.json`:

```json
{
  "name": "ping",
  "description": "Check the bot response"
}
```

The package requires a `name` from 1 to 32 characters and a `description` from 1 to 100 characters.
Add other Discord application command fields when required. Discord checks those fields when it sends the command.

## Handler

Create `src/commands/ping.mjs` with the command behavior:

```js
export default async function ping(context, interaction) {
  await interaction.reply("Pong!");
}
```

Create `commands/ping.mjs` as an adapter that exports the source handler:

```js
export { default } from "../src/commands/ping.mjs";
```

The package loads the adapter that matches the JSON file name.
It passes `context` first, then the event arguments.
The context contains `client`, `log`, `msg`, and values from the `context` option.
Use the command name for the JSON definition, adapter, and handler.

## Registration

`createDiscord` registers valid definitions that have matching handler files.
It skips a definition when validation fails or its handler file is missing.
It logs a warning when the command folder is missing or unreadable.

The package registers commands only when it has at least one valid definition.
On startup, it updates matching global commands and creates new commands one at a time.
It keeps commands that the app does not provide.
It also keeps remote commands when the app no longer has a matching definition or handler.
If Discord rejects a command request, `createDiscord` rejects and cleans up the client.

If no valid definitions exist, the package skips registration and logs a warning.
The package does not delete commands automatically.
Use `purgeCommands` to delete global commands or commands for one guild.

The package provides handlers to the app's `interactionCreate` event context.
Add an event handler that reads the interaction command name and calls the matching handler.
The package does not reply to command interactions for the app.

Create `src/events/interactionCreate.mjs`:

```js
export default async function interactionCreate(context, interaction) {
  if (!interaction.isChatInputCommand()) return;
  const handler = context.commandHandlers[interaction.commandName];
  if (handler) await handler(context, interaction);
}
```

Create `events/interactionCreate.mjs` as an adapter:

```js
export { default } from "../src/events/interactionCreate.mjs";
```

Read the [events guide](events.md) and [API guide](api.md) for handler details.
