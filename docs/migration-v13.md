# Migrate to version 13

Use this guide to update an app from an earlier `@eliware/discord` version.

## Update the package

When version 13 is available, install it with this command:

```sh
npm install @eliware/discord@13
```

## Set the app root

Version 13 uses the current working directory as the default `rootDir`.
Run the app from its root folder to use the default command, event, and locale folders.
If the process starts from a different folder, pass `rootDir` to `createDiscord`.

## Update the logger

If the app passes `log`, make sure the logger has a `child()` method.
Make sure `child()` returns a logger.
The default `@eliware/log` logger meets this requirement.

## Move command logic

Keep each command definition in `commands/<name>.json`.
Move the command logic to `src/commands/<name>.mjs`.
Keep `commands/<name>.mjs` as an adapter that re-exports the source handler:

```js
export { default } from "../src/commands/<name>.mjs";
```

## Move event logic

Keep each event adapter in `events/<event>.mjs`.
Move event behavior to `src/events/<event>.mjs`.
Keep the adapter focused on exporting its source handler:

```js
export { default } from "../src/events/<event>.mjs";
```

## Update shutdown

Call and await `client.shutdown()` to stop a client created by the package.
Do not call `client.destroy()` directly because it skips package cleanup.

When the app owns other services, use one app shutdown coordinator.
Stop app services in their required order, then call and await `client.shutdown()`.
Connect the same coordinator to signal and manual shutdown.

When Discord is optional, pass `enabled: false` to `createDiscord` when the app disables Discord.
The function returns `null` without loading Discord files or checking credentials. Check the result
before you access the client or call its `shutdown()` method.

Remove `setupLocalesFn`, `setupCommandsFn`, `setupEventsFn`, and `registerCommandsFn` options.
Version 13 does not expose internal setup replacement hooks. Use the supported app folders.
Remove the `ClientClass` option. Version 13 creates the supported Discord.js client directly.

Remove imports of `shutdownDiscord`. Call and await `client.shutdown()`.
Version 13 returns `null` when Discord is disabled, so check the result before you use the client.

## Keep app behavior in the app

Keep AI, voice, database, broker, health, and other app behavior outside the package.
Pass app services to event and command handlers through the `context` option.
Read [usage](usage.md), [commands](commands.md), [events](events.md), and [lifecycle](lifecycle.md)
for the full setup details.
