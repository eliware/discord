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

Keep library code in `src/`. Keep app files in the consuming app.

## npm publication

Use the Eliware approval process before npm publication.
