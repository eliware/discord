# Release Notes

## Unreleased

### Changed

Pending changes.

## 12.0.0 — 2026-10-12

### Changed

The package uses current Eliware packages and the shared validation workflow.
The public package files and repository guides follow the current conventions.

## 2.0.0 — 2026-08-25

### Changed

Gateway intents are off by default. Apps must enable each required intent.
The client has an idempotent `shutdown()` method.

### Added

The public API includes `purgeCommands()` for explicit command cleanup.
