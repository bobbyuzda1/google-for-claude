---
name: status
description: Check credential health for all configured Google services. Reports which services are valid, expired, or not configured. Use when user runs /gfc:status.
---

# Google for Claude — Status Check

Run the following checks and report results in a table. Do NOT echo any API keys, tokens, or credentials — only report the status.

## Checks to Run

1. **Gemini API key:**
   - Run: `test -n "$GEMINI_API_KEY" && echo "set" || echo "not set"`
   - If set, validate: `curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY" | head -1`
   - Status: "valid" / "invalid key" / "not configured"

2. **ADC (Application Default Credentials):**
   - Run: `test -f ~/.config/gcloud/application_default_credentials.json && echo "exists" || echo "missing"`
   - Status: "valid" / "not configured"

3. **gcloud CLI auth:**
   - Run: `gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null`
   - Status: "valid (user@email)" / "not configured"

4. **Google Workspace:**
   - Run: `gws drive files list --limit 1 2>/dev/null`
   - Status: "valid" / "expired — run `/gfc:setup workspace`" / "not configured"

5. **Firebase:**
   - Run: `firebase projects:list --limit 1 2>/dev/null`
   - Status: "valid" / "expired — run `/gfc:setup firebase`" / "not configured"

6. **NotebookLM:**
   - Run: `nlm status 2>/dev/null`
   - Status: "valid" / "expired — run `nlm login`" / "not configured"

7. **Google Maps:**
   - Status: "available (no auth needed)" if `@googlemaps/code-assist-mcp` is accessible

## Output Format

Report as a table:

| Service | Status | Action needed |
|---|---|---|
| Gemini | valid | — |
| Workspace | expired | Run `/gfc:setup workspace` |
| Firebase | valid | — |
| Google Cloud | valid | — |
| Cloud Storage | valid (uses ADC) | — |
| NotebookLM | not configured | Run `/gfc:setup notebooklm` |
| Google Maps | available | — |

## Output Preference

Also report the current output path:
- Read `~/.config/gfc/preferences.json` and show the `outputPath` value
- If file doesn't exist: "Output path: not set (run `/gfc:setup` to configure)"
