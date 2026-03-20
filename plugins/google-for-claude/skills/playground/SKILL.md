---
name: playground
description: Launch the visual GFC Playground dashboard in your browser. Mario-themed interactive UI for setup, configuration, and service status. Use when user runs /gfc:playground or asks to open the visual dashboard.
---

# Google for Claude — Playground

Launch the GFC Playground — a Mario-themed visual dashboard for setup and configuration.

## Launch Steps

1. Find the playground files in the plugin directory. The server and HTML are at:
   - `${CLAUDE_PLUGIN_ROOT}/playground/server.js`
   - `${CLAUDE_PLUGIN_ROOT}/playground/index.html`

2. Start the playground server in the background:
```bash
node "${CLAUDE_PLUGIN_ROOT}/playground/server.js" &
```

3. Wait 1 second for it to start, then tell the user:
> **GFC Playground is running!** Open your browser to: **http://localhost:8764**
>
> The dashboard auto-refreshes every 3 seconds and shows your service configuration status.
> Click any service card to trigger its setup, or use the Quick Actions buttons.
>
> **Leave this Claude Code session open** — the playground communicates back here.

4. Monitor for pending actions. Periodically check `~/.config/gfc/pending-action.json`:
```bash
cat ~/.config/gfc/pending-action.json 2>/dev/null
```

When an action is found, execute it:
- `setup` → Run the full setup wizard (invoke google-for-claude:setup skill)
- `setup-gemini` → Run `/gfc:setup gemini`
- `setup-workspace` → Run `/gfc:setup workspace`
- `setup-firebase` → Run `/gfc:setup firebase`
- `setup-gcloud` → Run `/gfc:setup gcloud`
- `setup-notebooklm` → Run `/gfc:setup notebooklm`
- `status` → Run the status check (invoke google-for-claude:status skill)
- `test-gemini` → Test the Gemini API with a simple query
- `test-image` → Generate a test image with Nano Banana
- `set-output-path` → Update `~/.config/gfc/preferences.json` with the new output path

After executing an action, delete the pending action file:
```bash
rm ~/.config/gfc/pending-action.json 2>/dev/null
```

## Stopping the Playground

When the user is done, stop the server:
```bash
pkill -f "node.*playground/server.js" 2>/dev/null
```

## Error Handling

- If port 8764 is already in use, try killing the old process first: `lsof -ti:8764 | xargs kill 2>/dev/null`
- If the server fails to start, check that Node.js is installed
