# AGENTS.md

## Project

`@eliware/discord` is an ESM-first Discord application framework for Node.js. It provides dependency-injectable client setup, slash commands, events, localization, and optional lifecycle integrations.

## Development

- Use Node.js 26.
- Preserve the ESM-only public API and named/default export shape.
- Keep application-owned commands, events, and locales in the consuming project.
- Preserve dependency injection for the Discord client, loaders, logger, and registration helpers.
- Do not connect to Discord during tests or module import.
- Never log bot tokens, credential-bearing URLs, private data, or sensitive event payloads.

## API and compatibility

- Keep `index.d.ts`, README examples, and runtime exports synchronized.
- Preserve `createDiscord()` options and the `client.shutdown()` lifecycle contract.
- Keep process signal and exception integrations opt-in.
- Preserve compatibility aliases such as `client_id` when changing option names.
- Keep command, event, locale, and validation behavior covered by focused tests.

## Testing

Run before committing:

```bash
npm test
npm run test:gaps
npm run lint
npm run typecheck
npm run pack
```

Maintain 100% statements, branches, functions, and lines coverage. Do not use Istanbul ignore directives to hide gaps. A live Discord connection is not required; inject test doubles instead.

## Documentation and examples

Update README documentation and TypeScript declarations with public API changes. Keep examples credential-free and safe to run. Document required Discord application credentials, intents, permissions, shutdown behavior, and error handling.

## Security

Keep Discord tokens and application credentials in environment variables or secret storage. Review requested Gateway intents and bot permissions before deployment. Do not commit `.env` files or secrets.

## Release

Do not bump versions, edit release notes, tag, publish, deploy, or push unless explicitly requested. Before release, run all validation commands above and review package contents with `npm pack --dry-run`.
