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
The method runs only once for each client.

## Signals

Set `signals: true` to add signal handlers from `@eliware/signals`.
The package runs client cleanup before it calls a custom `signalOptions.shutdownHook`.
It sets `exit: false`, so the signal handler does not exit the process.

## Process errors

Set `processHandlers: true` to add handlers from `@eliware/errors`.
The dependency handles uncaught exceptions, unhandled rejections, and warnings by default.
The package removes these handlers during client shutdown.

Read [configuration](configuration.md) to set handler options.
