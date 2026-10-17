# AGENTS.md

## Project

Maintain `@eliware/discord`, a Node.js package for Discord apps.

## Scope and boundaries

Maintain the package and tests.

## Layout

Keep package source in `src/`, tests in `tests/`, guides in `docs/`, and examples in `examples/`.

## Development

Use Node.js 26 and native ESM.

## Validation

Run `npm test`, `npm run lint`, `npm run audit`, `npm run format`, and `npm run format:check`.
Run `npm run typecheck` and `npm run pack`.

## Security

Keep credentials out of source control.

## Changes

Run validation before you commit changes.

## Library

Keep library code in `src/` and app files in the consuming app.
Run focused tests first during development.
Run one test file with `npm test -- tests/path/to/example.test.mjs`.
Run multiple test files with `npm test -- tests/path/to/first.test.mjs tests/path/to/second.test.mjs`.
Prevent repeated full-suite runs during development.
Run the full `npm test` suite for final validation before a commit, milestone, or release.

## npm publication

Use the Eliware approval process before npm publication.
