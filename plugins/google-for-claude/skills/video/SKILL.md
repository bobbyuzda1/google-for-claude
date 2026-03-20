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
- **If the user provides a reference image containing real human faces**, warn: "Veo's safety filter blocks video generation from images containing recognizable human faces. Use a text-only prompt or a stylized/illustrated reference image instead."

## Generate

Use the `gemini` MCP server tools to submit a video generation request. Video generation is async — it takes 1-5 minutes:

1. Submit the generation request using `predictLongRunning` (not `generateContent`)
2. Tell the user: "Video generation submitted. This typically takes 1-5 minutes."
3. Poll the operation URL for completion every 15 seconds
4. When done, download the result from the returned video URI

## Save Output

- Read output path from `~/.config/gfc/preferences.json`
- If no preference file exists, ask: "Where should I save generated files? Default: `./gfc-output/`"
- **When downloading the video file, always follow redirects** (the download URI returns a 302 redirect — without following it you'll get an error JSON instead of the video)
- Save as: `gfc-video-YYYY-MM-DD-<short-slug>.mp4`
- Create the output directory if it doesn't exist
- Tell the user where the file was saved

## Error Handling

If the MCP tool call fails, detect the error type and respond:

- **Auth missing/invalid:** "Gemini is not configured. Run `/gfc:setup gemini` to set it up."
- **Token expired:** "Your Gemini credentials have expired. Run `/gfc:setup gemini` to re-authenticate."
- **Rate limited (429):** "You've hit the free tier rate limit. Wait a minute or enable billing for higher limits."
- **Wrong tier / billing required:** "Veo requires a paid API tier. Enable billing at console.cloud.google.com/billing."
- **RAI content filter:** "Veo's safety filter blocked this video. This often happens with reference images containing real faces, or prompts involving violence. Try rephrasing or using a text-only prompt."
- **MCP server not responding:** "The gemini MCP server isn't responding. Try restarting Claude Code or run `/gfc:status` to diagnose."

Never fail silently. Every error must point to a specific recovery action.
