# Release Notes

## 13.0.0 — 2026-10-17

### Added

- The package adds consumer, lifecycle, module responsibility, and workflow specifications.
- The package adds a guide to migrate apps to version 13.
- The guides show how apps use command and event adapters with focused source modules.
- The lifecycle guide shows how apps stop services and the Discord client.

### Changed

- The package version changes to 13.0.0 in `package.json` and `package-lock.json`.
- The default app root is the current working directory.
- Apps keep command definitions and adapters in `commands/` and event adapters in `events/`.
- Apps keep command and event logic in focused modules under `src/`.
- Apps own their business logic and manage shutdown for their services.
- Command helpers and tests use focused `command/` folders.
- The npm workflow uses the canonical name and checks that the release tag matches the package version.
- The CI and npm workflows fetch full Git history and use `actions/checkout@v7`.
- The Knit workflow uses `/eliware/discord` and pulls repository updates before deployment.
- The guides use ASD-STE100 wording and cover setup, commands, events, lifecycle, migration, and troubleshooting.
- The package updates its development instructions and specification indexes.

### Breaking changes

- `createDiscord` requires a logger with a `child()` method that returns a logger.
- The package does not support a second lifecycle for the same client instance.

### Fixed

- The package resolves default command, event, and locale folders from the app root.
- The package updates command and event examples to use the adapter layout.
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
