# Lifecycle

`createDiscord` checks credentials and options, creates a Discord.js client, and loads app files.
It sends slash commands when valid definitions exist. It then connects to Discord.
The function returns the connected client.

## Startup errors

If setup or login fails, the package calls its cleanup steps and rejects with an error.
Login errors include the source error as their cause.

## Shutdown

Call and await `client.shutdown()` to stop the client.
The method removes event listeners, clears locale data, removes optional signal and process handlers, and destroys the client.
Repeated calls share the same shutdown promise. Cleanup runs once, and every call waits for it to complete.

## Apps with other services

When an app also owns a database, broker, voice connection, or server, give the app one shutdown
coordinator. Use that coordinator for signal and manual shutdown. Stop app resources in the required
order, then call and await `client?.shutdown()` when Discord is enabled.

Do not call `client.destroy()` directly. That call skips the package cleanup.

Use one promise to prevent repeated cleanup:

```js
let shutdownPromise;

function shutdownApp() {
  shutdownPromise ??= (async () => {
    try {
      await stopAppServices();
    } finally {
      await client.shutdown();
    }
  })();
  return shutdownPromise;
}
```

Define `stopAppServices` in the app. Connect `shutdownApp` to the app's signal handler.
Call `shutdownApp` for manual shutdown too.

## Signals

Set `signals: true` to add signal handlers from `@eliware/signals`.
The package runs client cleanup before it calls a custom `signalOptions.shutdownHook`.
It sets `exit: false`, so the signal handler does not exit the process.

Use this option when the app only needs Discord cleanup.
When the app manages other services, keep signal handling in the app and call its shutdown
coordinator. Do not use two signal coordinators.

## Process errors

Set `processHandlers: true` to add handlers from `@eliware/errors`.
The dependency handles uncaught exceptions, unhandled rejections, and warnings by default.
The package removes these handlers during client shutdown.

Read [configuration](configuration.md) to set handler options.
