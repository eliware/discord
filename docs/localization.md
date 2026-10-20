# Localization

Store one flat JSON message map in each locale file.
The file name without `.json` is the locale name, such as `en-US`.
Set `localesDir` to change the folder.

Create `locales/en-US.json`:

```json
{
  "welcome": "Welcome!",
  "error": "An error occurred."
}
```

Each file must contain one JSON object. Each value must be a string.
Nested objects and other value types are not valid.

Call `msg(locale, key, defaultValue)` from the event context:

```js
const text = context.msg("en-US", "welcome", "Welcome");
```

The lookup uses the requested locale first. If that locale is missing, it tries `en-US`.
If the key is missing, it returns `defaultValue`.
If no `en-US` map exists, it returns `defaultValue`.
When you omit `defaultValue`, the function returns `An important error occurred.`.

`createDiscord` loads locale files during setup and clears locale data during shutdown.
The package keeps locale maps in one process-wide store.
Run one Discord client in each process because each setup replaces the shared locale maps.
When the locale folder is missing, lookups use the supplied default text.
The package logs an error and skips a locale file when its JSON or values are invalid.
