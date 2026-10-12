# AGENTS.md

## Project

Maintain `@eliware/discord`, a Node.js package for Discord apps.

## Scope and boundaries

Maintain the package and its tests. Do not own app files or Discord accounts.
Do not connect a live bot during local validation.

## Layout

Keep package source in `src/`. Keep tests in `tests/`.
Keep guides in `docs/`, examples in `examples/`, and rules in `specs/`.

## Development

Use Node.js 26 or later. Use native ESM.
Use dependency injection for Discord clients and file loaders in tests.

## Validation

Run `npm test` for aggregate validation.
Run `npm run lint` for lint checks.
Run `npm run audit` for package audit checks.
Run `npm run format` to format files.
Run `npm run format:check` to check file format.
Run `npm run typecheck` for TypeScript checks.
Run `npm run pack` for package checks.

## Security

Keep tokens and private data out of source control and logs.
Review gateway intents and permissions before live use.

## Changes

Keep guides, examples, and release notes current.
Run validation before you commit changes.

## Library

Keep package code in `src/`.
Keep app commands, events, and locales in the consuming app.
Maintain one matching test for each source module.

## npm publication

Use the Eliware approval process before npm publication.
Validation does not grant publication authority.
