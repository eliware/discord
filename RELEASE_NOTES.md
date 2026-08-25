# Release notes

## 2.0.0 — Unreleased

- Adopted the shared `@eliware/test` harness for testing and linting with
  strict 100×4 coverage and removed direct Jest/Oxlint dependencies.
- Updated CI validation for Ubuntu and Windows, production dependency auditing,
  and separate tag-only publishing.
- Added public package publishing configuration and included release notes in
  the package allowlist.
- Removed the unused `dotenv` runtime dependency.
- Breaking: the standard `test` and `lint` scripts now delegate to
  `@eliware/test`; the package remains ESM-only.

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
