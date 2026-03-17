---
name: image
description: Generate images using Google Gemini Nano Banana or Imagen. Use when user runs /gfc:image or asks to generate an image with Google/Gemini.
---

# Google for Claude — Image Generation

Generate an image using the Gemini MCP server.

## Parse Arguments

- **Prompt:** Everything after `/gfc:image` that isn't a flag
- **Flags:**
  - `--pro` or `--hq` → use model `gemini-3-pro-image-preview` (4K, limited free tier ~2-3/day)
  - `--imagen` → use model `imagen-4.0-generate-001` (PAID — $0.04/image)
  - No flag → use model `gemini-2.5-flash-image` (free, 500 RPD)

## Before Generating

- If `--imagen` flag is used, warn: "Imagen 4 requires a paid API tier ($0.04/image). Continue? (yes/no)"
- If `--pro` flag is used, note: "Using Nano Banana Pro — limited to ~2-3 images/day on free tier."
- If `GEMINI_API_KEY` is not set, stop and say: "Gemini API key not found. Run `/gfc:setup gemini` to configure."

## Generate

Use the `gemini` MCP server tools to generate the image with the selected model and the user's prompt.

## Save Output

- Read output path from `~/.config/gfc/preferences.json` (`outputPath` field)
- If no preference file exists, ask: "Where should I save generated files? Default: `./gfc-output/`"
- Save the image with a descriptive filename: `gfc-image-YYYY-MM-DD-<short-slug>.png`
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
