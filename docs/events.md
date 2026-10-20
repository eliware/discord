# Events

Store one event adapter in each `.mjs` file in the app event folder.
The file name without `.mjs` is the Discord event name.
Set `eventsDir` to use a custom folder.
Keep event behavior in focused modules under `src/events/`.
The package logs a warning when the event folder is missing or unreadable.

## Handler

Create `src/events/clientReady.mjs` with a default function:

```js
export default async function ready(context) {
  context.log.info("Discord client is ready");
}
```

Create `events/clientReady.mjs` as an adapter:

```js
export { default } from "../src/events/clientReady.mjs";
```

The package calls the handler with `context` first, then the Discord event arguments.
The context contains `client`, `log`, `msg`, and values from the `context` option.
The `commandHandlers` map contains handlers for registered slash commands.
Use this map in the `interactionCreate` handler to call the matching command.

## Errors and cleanup

The package catches rejected handler promises and sends errors to its logger.
It continues to run other event handlers.

`createDiscord` removes its event listeners during `client.shutdown()`.
