---
name: music
description: Generate music using Google Lyria. Use when user runs /gfc:music or asks to generate music/audio loops with Google.
---

# Google for Claude — Music Generation

Generate music using the Gemini MCP server and Lyria.

## Parse Arguments

- **Prompt:** Everything after `/gfc:music` that isn't a flag
- **Flags:**
  - `--bpm <number>` → set BPM (60-200, default: auto)
  - No flags → use model `lyria-realtime-exp` with default settings

## Before Generating

- If `GEMINI_API_KEY` is not set, stop and say: "Gemini API key not found. Run `/gfc:setup gemini` to configure."
- Note: "Lyria is experimental — expect rate limit restrictions."

## Generate

Use the `gemini` MCP server tools to generate music with `lyria-realtime-exp`. Supports instrumental audio with BPM control, density, key, brightness, and weighted text prompts.

## Save Output

- Read output path from `~/.config/gfc/preferences.json`
- If no preference file exists, ask: "Where should I save generated files? Default: `./gfc-output/`"
- Save as: `gfc-music-YYYY-MM-DD-<short-slug>.wav`
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
