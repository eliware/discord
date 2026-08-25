# Release notes

## 2.0.0 — 2026-08-25

- Breaking: all Discord Gateway intents are now disabled by default and must be
  explicitly enabled by the consuming application.
- Breaking: the standard `test` and `lint` scripts now delegate to the shared
  `@eliware/test` harness; direct Jest/Oxlint dependencies were removed.
- Breaking: upgraded the runtime dependency on `@eliware/common` to the 2.x
  shared stack and removed the unused `dotenv` runtime dependency.
- Added the typed `DiscordClient` return contract, including the idempotent
  `client.shutdown()` lifecycle method.
- Added `purgeCommands()` to the root public API for explicit administrative
  command cleanup; it is never invoked automatically.
- Modernized CI validation for Node.js 26 on Ubuntu and Windows, added
  production dependency auditing, and separated validation from tag-only
  publishing.
- Added public npm publishing metadata and included release notes in the
  package allowlist.
- Maintained native ESM, dependency injection, application-owned resources,
  strict 100×4 coverage, and focused failure/cleanup tests.

## 1.1.4 — 2026-08-07

- Standardized validation scripts, TypeScript checking, CI, and package metadata.
- Updated `@eliware/common` to 1.1.7.
- Expanded requirements, troubleshooting, development, and security documentation.

## 1.1.3

- Modernized Discord lifecycle management and shared integrations.
- Added opt-in signal and process-handler integrations with shutdown cleanup.
- Improved validation, dependency injection, TypeScript declarations, and test coverage.
- Clarified ESM usage, application-owned resources, localization, and lifecycle APIs.
- Updated Node.js 26 CI and Docker examples.

## 1.1.2

- Previous published release.

## 1.1.1

- Previous published release.

## Unreleased history before 1.1.1

- Initial Discord application framework and command, event, and localization support.
