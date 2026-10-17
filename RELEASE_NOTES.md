# Release Notes

## 13.0.0 — 2026-10-17

### Changed

The package aligns its source, tests, documentation, and workflows with the current Eliware conventions.
Command source files and matching tests use dedicated `command/` folders.
The package uses the canonical npm workflow and aligned CI and Knit workflows.
The package documents its public API, setup, commands, lifecycle, and troubleshooting in ASD-STE100 language.
The package updates its development instructions, specifications, and workflow indexes.

### Fixed

CI fetches full Git history and follows the shared test workflow.
Locale and event messages use direct wording.

## 12.0.0 — 2026-10-12

### Added

The package includes end-user guides and a runnable example.
The package adds focused modules for client options, command removal, and message splitting.

### Changed

The package stores source files and TypeScript declarations in `src/`.
The package replaces `@eliware/common` with `@eliware/errors`, `@eliware/log`, `@eliware/path`, and `@eliware/signals`.
The package validates command names, client options, locale maps, and app context.
The package uses updated CI, npm publishing, and Knit deployment workflows.
The package documents setup, commands, events, locales, lifecycle, and the public API.

### Fixed

Command handler names must match their command definition files.
The package cleans up event listeners after setup and command errors.
Locale lookups return the fallback for inherited names.
Message splitting rejects fractional maximum lengths.
The package skips invalid event handlers and uses the parent logger when a child logger is missing.
The package supports repeated shutdown for a reused client.

## 2.0.0 — 2026-08-25

### Added

The initial stable baseline includes optional signal and process error handlers with shutdown cleanup.
The package adds the typed `DiscordClient` contract and idempotent `client.shutdown()` method.
The package adds `purgeCommands()` for explicit command cleanup.
The package adds npm publication metadata and release notes to its published files.
The package adds Node.js 26 validation and tag-only npm publication workflows.
The documentation covers ESM use, app files, locales, client lifecycle, setup, and troubleshooting.

### Changed

The package switches to the `@eliware/common` 2.x stack and removes `dotenv`.
The package disables all gateway intents by default. Apps must enable each required intent.
The test and lint scripts use the shared `@eliware/test` harness.
The team standardizes validation scripts, TypeScript checks, CI, and package metadata.

### Fixed

The package improves Discord lifecycle management and shared package integrations.
The package improves validation, test control, TypeScript declarations, and test coverage.
The package standardizes Docker examples and Node.js 26 CI.
