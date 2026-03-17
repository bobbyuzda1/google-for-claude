---
name: tts
description: Convert text to speech using Google Gemini TTS. Use when user runs /gfc:tts or asks to convert text to speech/audio with Google.
---

# Google for Claude — Text-to-Speech

Generate speech audio using the Gemini MCP server TTS models.

## Parse Arguments

- **Text:** Everything after `/gfc:tts` that isn't a flag. Can be quoted or unquoted.
- **Flags:**
  - `--pro` → use model `gemini-2.5-pro-preview-tts` (higher fidelity)
  - `--voice <name>` → use specified voice (Kore, Puck, Charon, Fenrir, Aoede, Leda, Zephyr, etc.)
  - No flags → use model `gemini-2.5-flash-preview-tts` with default voice

## Before Generating

- If `GEMINI_API_KEY` is not set, stop and say: "Gemini API key not found. Run `/gfc:setup gemini` to configure."

## Generate

Use the `gemini` MCP server tools to generate speech with the selected model, voice, and text input. The TTS models produce audio-only output.

## Save Output

- Read output path from `~/.config/gfc/preferences.json`
- If no preference file exists, ask: "Where should I save generated files? Default: `./gfc-output/`"
- Save as: `gfc-tts-YYYY-MM-DD-<short-slug>.wav`
- Create the output directory if it doesn't exist
- Tell the user where the file was saved

## Error Handling

If the MCP tool call fails, detect the error type and respond:

- **Auth missing/invalid:** "Gemini is not configured. Run `/gfc:setup gemini` to set it up."
- **Token expired:** "Your Gemini credentials have expired. Run `/gfc:setup gemini` to re-authenticate."
- **Rate limited (429):** "You've hit the free tier rate limit. Wait a minute or enable billing for higher limits."
- **Wrong tier / billing required:** "This feature requires a paid API tier. Enable billing at console.cloud.google.com/billing."
- **MCP server not responding:** "The gemini MCP server isn't responding. Try restarting Claude Code or run `/gfc:status` to diagnose."

Never fail silently. Every error must point to a specific recovery action.
