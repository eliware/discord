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

`createDiscord` loads locale files during setup and clears them during shutdown.
Direct calls to `setupLocales` replace all locale data in memory.
