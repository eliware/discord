# Release Notes

## 15.0.1 — 2026-10-26

### Changed

- The package version and lock file change to 15.0.1. The Eliware runtime packages and `@eliware/test` update to 15.0.1.
- Client startup and event initialization use focused helpers for shutdown setup and event listener cleanup.
- Command validation enforces Discord chat input naming rules. The loader logs and skips invalid command names.
- Command documentation and the consumer specification state the supported command name rules.
- Shutdown removes process handlers and destroys the client when signal handler removal fails.
- Command registration tests remove duplicate checks and keep distinct reconciliation and request cases.

## 15.0.0 — 2026-10-21

### Changed

- The package version changes to 15.0.0. The Eliware runtime packages and `@eliware/test` change to version 15.
- The package updates its installed dependencies to their latest compatible versions.
- The consumer, directives, lifecycle, and module structure specifications identify version 15.0.
- Client option setup checks each option before it maps the settings to Discord.js values.
- Command definition validation separates object, name, and description checks into focused modules.
- Locale setup uses a focused helper to remove prior entries before it adds loaded definitions.
- Test suites use a shared helper to set and restore credential environment variables.
- The migration guide covers installation, runtime requirements, app configuration, command removal, shutdown, and the runnable example.
- The documentation index links to the version 15 migration guide.

### Fixed

- Shutdown removes optional signal and process handlers that become active during setup.

## 14.0.0 — 2026-10-21

### Added

- The package adds focused modules for logger creation, client options, command collection, command registration, event context, login, shutdown, and locale error reporting.
- The guides list credentials, Discord OAuth scopes, app folder layout, and migration steps.
- The basic example guide gives test bot setup steps, PowerShell and Bash commands, and expected login output.

### Changed

- The package and Eliware runtime dependencies change to version 14. The `@eliware/test` development dependency also changes to version 14.
- Command registration separates HTTP requests from command reconciliation.
- Locale setup uses focused discovery, read, parse, and store helpers. Each client keeps an isolated locale store.
- Event setup returns a cleanup function if event discovery fails.
- The package removes the redundant locale loader and updates tests for the focused modules.
- The README, contributor instructions, and documentation index remove content that the repository conventions do not require.
- The API, configuration, and troubleshooting guides state that a guild ID selects the guild route for `purgeCommands`. Without a guild ID, `purgeCommands` uses the global route.

## 13.0.0 — 2026-10-19

### Added

- The package adds consumer, lifecycle, module responsibility, and workflow specifications.
- The package adds a migration guide for version 13.
- The guides cover app setup, commands, events, locales, lifecycle, and common problems.
- The examples show that apps can use command and event adapters with app logic in focused source modules.

### Changed

- The package version changes to 13.0.0. The Eliware runtime packages and `@eliware/test` change to version 13.
- The package declares the Discord API request client as a direct dependency.
- The default app root changes to the current working directory.
- Apps keep command definitions and adapters in `commands/`. Apps keep event adapters in `events/`.
- Apps keep command and event logic in focused modules under `src/`.
- Apps own their business logic and manage shutdown for their services.
- `enabled: false` makes `createDiscord` return `null` without starting Discord.
- Each Discord client gets its own locale store. Client shutdown clears only that client's locale data.
- Startup creates or updates each valid command individually and preserves unrelated global commands.
- The package separates command, event, locale, client option, handler registration, and shutdown code into focused modules.
- Tests use focused suites and shared test fixtures for command, event, locale, and shutdown behavior.
- The CI and npm workflows use `actions/checkout@v7` and fetch full Git history where required.
- The npm workflow uses the canonical `npm.yaml` name and checks that the release tag matches the package version.
- The Knit workflow uses `/eliware/discord` and pulls repository updates before deployment.
- The guides use ASD-STE100 wording. The migration guide documents logger and client lifecycle requirements.
- The package updates development instructions and specification indexes.
- The TypeScript declarations match the package exports and version 13 options.

### Breaking changes

- `createDiscord` requires a logger with a `child()` method that returns a logger.
- `createDiscord` can return `null` when `enabled` is `false`. Check the result before using the client.
- The package removes `shutdownDiscord` from the root exports. Call and await `client.shutdown()`.
- The package removes internal setup hooks and `ClientClass` from `createDiscord` options.
- Apps must use the version 13 command, event, locale, and module layout.

### Fixed

- The package resolves command, event, and locale folders from the app root.
- The package removes obsolete compatibility paths.
- The package cleans up event listeners and optional handlers after setup, registration, and login errors.
- The package preserves available process-handler cleanup when handler setup fails.
- The package removes an invalid TypeScript declaration import and keeps `splitMsg` in the root type API.
- Locale, event, and command messages use direct wording.

## 12.0.0 — 2026-10-12

### Added

- The package includes end-user guides and a runnable example.
- The package adds focused modules for client options, command removal, and message splitting.

### Changed

- The package stores source files and TypeScript declarations in `src/`.
- The package replaces `@eliware/common` with `@eliware/errors`, `@eliware/log`, `@eliware/path`, and `@eliware/signals`.
- The package validates command names, client options, locale maps, and app context.
- The package uses updated CI, npm publishing, and Knit deployment workflows.
- The package documents setup, commands, events, locales, lifecycle, and the public API.

### Fixed

- Command handler names match their command definition files.
- The package cleans up event listeners after setup and registration errors.
- Locale lookups return a fallback for inherited names.
- Message splitting rejects fractional maximum lengths.
- The package handles invalid event handlers and logger child results.
- The package supports repeated shutdown for a reused client.

## 2.0.0 — 2026-08-25

### Added

- The initial stable baseline includes optional signal and process error handlers with shutdown cleanup.
- The package adds the typed `DiscordClient` contract and idempotent `client.shutdown()` method.
- The package adds `purgeCommands()` for explicit command cleanup.
- The package adds npm publication metadata and release notes to its published files.
- The package adds Node.js 26 validation and tag-only npm publication workflows.
- The documentation covers ESM use, app files, locales, client lifecycle, setup, and troubleshooting.

### Changed

- The package switches to the `@eliware/common` 2.x stack and removes `dotenv`.
- The package disables all gateway intents by default. Apps must enable each required intent.
- The test and lint scripts use the shared `@eliware/test` harness.
- The team standardizes validation scripts, TypeScript checks, CI, and package metadata.

### Fixed

- The package improves Discord lifecycle management and shared package integrations.
- The package improves validation, test control, TypeScript declarations, and test coverage.
- The package standardizes Docker examples and Node.js 26 CI.
