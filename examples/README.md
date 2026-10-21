# Examples

## Basic app

Use this example to connect a test bot to Discord. Run it only with a bot that you control.

### Requirements

- Install Node.js 26 or newer.
- Create an application named `Discord Library Test Bot` in the Discord Developer Portal.
- Add a bot user to the application and set its username to `Discord Library Test Bot`.
- Invite the bot to a test server that you control. Grant the `bot` and `applications.commands` OAuth scopes.
- Copy the application ID and bot token. Keep the token private.

### Run the example in PowerShell

Run the commands from the repository root.
Replace each placeholder with a test bot credential.

```powershell
$env:DISCORD_CLIENT_ID = "<application-id>"
$env:DISCORD_TOKEN = "<bot-token>"
node examples/basic.mjs
```

### Run the example in Bash

Run this command from the repository root.
Replace each placeholder with a test bot credential.

```sh
DISCORD_CLIENT_ID="<application-id>" DISCORD_TOKEN="<bot-token>" node examples/basic.mjs
```

### Expected result

The terminal displays the test bot's Discord tag after `Connected as` when the bot logs in.
The process stays active until you press Ctrl+C.
The example then shuts down the client.
