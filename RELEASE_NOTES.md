# Release Notes

## 12.0.0 — 2026-10-12

### Added

The package now includes end-user guides and a runnable example.
The package adds focused modules for client options, command removal, and message splitting.

### Changed

The package now stores source files and TypeScript declarations in `src/`.
The package replaces `@eliware/common` with `@eliware/errors`, `@eliware/log`, `@eliware/path`, and `@eliware/signals`.
The package now validates command names, client options, locale maps, and app context.
The package now uses updated CI, npm publishing, and Knit deployment workflows.
The package now documents setup, commands, events, locales, lifecycle, and the public API.

### Fixed

Command handler names must match their command definition files.
The package now cleans up event listeners after setup and registration errors.
Locale lookups now treat inherited names as missing keys.
Message splitting now rejects fractional maximum lengths.
The package now handles invalid event handlers and logger child results.
The package now supports repeated shutdown for a reused client.

## 2.0.0 — 2026-08-25

### Changed

The package disabled all gateway intents by default. Apps must enable each required intent.
The `test` and `lint` scripts switched to the shared `@eliware/test` harness.
The package used the `@eliware/common` 2.x stack and removed the unused `dotenv` package.

### Added

The package added the typed `DiscordClient` contract and idempotent `client.shutdown()` method.
The package added `purgeCommands()` for explicit command cleanup.
The package added npm publication metadata and release notes to its published files.
The team added Node.js 26 validation and tag-only npm publication workflows.

## 1.1.4 — 2026-08-07

### Changed

The team standardized validation scripts, TypeScript checks, CI, and package metadata.
The team updated `@eliware/common` to 1.1.7.
The team expanded setup, troubleshooting, development, and security docs.

## 1.1.3 — 2026-08-07

### Changed

The team updated Discord lifecycle management and shared package integrations.
The package improved validation, dependency injection, TypeScript declarations, and test coverage.
The team updated Node.js 26 CI and Docker examples.

### Added

The package added optional signal and process error handlers with shutdown cleanup.
The team added docs for ESM use, app files, locales, and client lifecycle.

## 1.1.2 — 2025-12-09

### Changed

The maintainers issued a maintenance release after version 1.1.1.

## 1.1.1 — 2025-12-09

### Added

The maintainers issued the first tagged Discord app framework release.
