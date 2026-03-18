---
name: transcribe
description: Transcribe audio files using Gemini multimodal. Use when user runs /gfc:transcribe or asks to transcribe audio/meeting recordings with Google.
---

# Google for Claude — Audio Transcription

Transcribe audio files using Gemini's multimodal audio understanding.

## Parse Arguments

- **File:** The audio file path after `/gfc:transcribe`
- **Flags:**
  - `--speakers` → include speaker diarization (label who said what)
  - `--timestamps` → include timestamps for each segment
  - No flags → plain transcription

## Before Transcribing

- If `GEMINI_API_KEY` is not set, stop and say: "Gemini API key not found. Run `/gfc:setup gemini` to configure."
- Verify the file exists and is a supported format (WAV, MP3, AIFF, AAC, OGG, FLAC)
- Note max input: 9.5 hours per prompt

## Transcribe

Use the `gemini` MCP server tools to send the audio file to `gemini-2.5-flash` as multimodal input with instructions to transcribe.

If `--speakers` is set, instruct the model to identify and label different speakers.
If `--timestamps` is set, instruct the model to include timestamps.

## Output

Display the transcription inline in the conversation. Do not save to a file unless the user asks.

## Error Handling

If the MCP tool call fails, detect the error type and respond:

- **Auth missing/invalid:** "Gemini is not configured. Run `/gfc:setup gemini` to set it up."
- **Token expired:** "Your Gemini credentials have expired. Run `/gfc:setup gemini` to re-authenticate."
- **Rate limited (429):** "You've hit the free tier rate limit. Wait a minute or enable billing for higher limits."
- **Wrong tier / billing required:** "This feature requires a paid API tier. Enable billing at console.cloud.google.com/billing."
- **MCP server not responding:** "The gemini MCP server isn't responding. Try restarting Claude Code or run `/gfc:status` to diagnose."

Never fail silently. Every error must point to a specific recovery action.
