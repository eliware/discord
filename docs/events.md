# Events

Store one event handler in each `.mjs` file in the app event folder.
The file name without `.mjs` is the Discord event name.
Set `eventsDir` to change the folder.

## Handler

Create a default function in each event file:

```js
export default async function ready(context) {
  context.log.info("Discord client is ready");
}
```

The package calls the handler with `context` first, then the Discord event arguments.
The context contains `client`, `log`, `msg`, and values from the `context` option.
For `interactionCreate`, it also contains the `commandHandlers` map.

## Errors and cleanup

The package catches rejected handler promises and sends errors to its logger.
It continues to run other event handlers. Set a custom `onHandlerError` only when you call `setupEvents` directly.

`createDiscord` removes its event listeners during `client.shutdown()`.
When you call `setupEvents` directly, call its returned `cleanup` function when the listeners are no longer needed.
