---
name: video
description: Generate videos using Google Veo. Use when user runs /gfc:video or asks to generate a video with Google/Veo.
---

# Google for Claude — Video Generation

Generate a video using the Gemini MCP server and Veo.

## Parse Arguments

- **Prompt:** Everything after `/gfc:video` that isn't a flag
- **Flags:**
  - `--fast` → use model `veo-3.1-fast-generate-preview` (lower latency)
  - No flag → use model `veo-3.1-generate-preview`

## Before Generating

- **Always warn:** "Video generation uses Veo 3.1 which requires a paid API tier. Continue? (yes/no)"
- If `GEMINI_API_KEY` is not set, stop and say: "Gemini API key not found. Run `/gfc:setup gemini` to configure."

## Generate

Use the `gemini` MCP server tools to submit a video generation request. Video generation is async — it takes 1-5 minutes:

1. Submit the generation request
2. Tell the user: "Video generation submitted. This typically takes 1-5 minutes."
3. Poll for completion
4. Download the result when ready

## Save Output

- Read output path from `~/.config/gfc/preferences.json`
- If no preference file exists, ask: "Where should I save generated files? Default: `./gfc-output/`"
- Save as: `gfc-video-YYYY-MM-DD-<short-slug>.mp4`
- Create the output directory if it doesn't exist
- Tell the user where the file was saved

## Error Handling

If the MCP tool call fails, detect the error type and respond:

- **Auth missing/invalid:** "Gemini is not configured. Run `/gfc:setup gemini` to set it up."
- **Token expired:** "Your Gemini credentials have expired. Run `/gfc:setup gemini` to re-authenticate."
- **Rate limited (429):** "You've hit the free tier rate limit. Wait a minute or enable billing for higher limits."
- **Wrong tier / billing required:** "Veo requires a paid API tier. Enable billing at console.cloud.google.com/billing."
- **MCP server not responding:** "The gemini MCP server isn't responding. Try restarting Claude Code or run `/gfc:status` to diagnose."

Never fail silently. Every error must point to a specific recovery action.
