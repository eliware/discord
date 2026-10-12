# Commands

Store slash command files in the app command folder. Set `commandsDir` to change that folder.
Each command uses a JSON definition and a matching native ESM handler.

## Definition

Create `commands/ping.json`:

```json
{
  "name": "ping",
  "description": "Check the bot response"
}
```

The package requires a `name` from 1 to 32 characters and a `description` from 1 to 100 characters.
Add other Discord application command fields as needed. Discord validates those fields during registration.

## Handler

Create `commands/ping.mjs` with a default function:

```js
export default async function ping(context, interaction) {
  await interaction.reply("Pong!");
}
```

The package maps each handler to its command file name. It passes `context` first, then the event arguments.
The context contains `client`, `log`, and `msg`. It also contains values from the `context` option.
Use the same base name for the JSON definition, the handler file, and the command name.

## Registration

`createDiscord` registers valid definitions that have matching handler files.
It skips a definition when validation fails or its handler file is missing.
It logs a warning when the command folder is missing or unreadable.

The package registers commands only when it has at least one valid definition.
It uses the application command endpoint, so Discord treats these as global commands.
The package does not delete commands automatically.
Use `purgeCommands` when you need to delete global commands or commands for one guild.

The package provides handlers to the app's `interactionCreate` event context.
Add an event handler that reads the interaction command name and calls the matching handler.
The package does not reply to command interactions for the app.

Create `events/interactionCreate.mjs`:

```js
export default async function interactionCreate(context, interaction) {
  if (!interaction.isChatInputCommand()) return;
  const handler = context.commandHandlers[interaction.commandName];
  if (handler) await handler(context, interaction);
}
```

Read the [events guide](events.md) and [API guide](api.md) for handler details.
