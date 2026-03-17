# Google for Claude (GFC)

A Claude Code plugin that brings Google AI and Cloud services into your terminal. One install, one setup wizard, and you're ready to generate images, videos, music, manage Drive, Gmail, Calendar, and more — all from Claude Code.

## Install

```
# Add the marketplace
/plugin marketplace add bobbyuzda1/google-for-claude

# Install the plugin
/plugin install google-for-claude

# Reload
/reload-plugins
```

## Setup

Run the interactive setup wizard:

```
/gfc:setup
```

The wizard will:
1. Detect what you already have configured
2. Install missing prerequisites automatically
3. Let you choose which services to enable
4. Walk you through browser-based authentication steps
5. Validate each credential before moving on

## Quick Start

After setup, use these shortcuts:

| Command | What it does |
|---|---|
| `/gfc:image "a sunset"` | Generate an image (free) |
| `/gfc:video "a timelapse"` | Generate a video (paid) |
| `/gfc:tts "Hello world"` | Text-to-speech (free) |
| `/gfc:music "jazz piano"` | Generate music (experimental) |
| `/gfc:search "latest news"` | Search with Google grounding (paid) |
| `/gfc:transcribe audio.mp3` | Transcribe audio (free) |
| `/gfc:drive "find reports"` | Search Google Drive |
| `/gfc:mail "unread"` | Check Gmail |
| `/gfc:calendar "this week"` | View calendar events |
| `/gfc:models` | Model ID reference |
| `/gfc:status` | Check credential health |
| `/gfc:setup` | Re-run setup wizard |

## Override Flags

Some commands support flags for model selection:

- `/gfc:image "prompt" --pro` — Use 4K Nano Banana Pro
- `/gfc:image "prompt" --imagen` — Use Imagen 4 (paid)
- `/gfc:tts "text" --voice Puck` — Use a specific voice
- `/gfc:tts "text" --pro` — Use Pro TTS (higher fidelity)
- `/gfc:video "prompt" --fast` — Use faster Veo variant
- `/gfc:music "prompt" --bpm 120` — Set BPM for music generation
- `/gfc:transcribe file.mp3 --speakers` — Include speaker labels
- `/gfc:transcribe file.mp3 --timestamps` — Include timestamps

## Services Included

| Service | MCP Server | Auth |
|---|---|---|
| Gemini (image, video, TTS, music, search, audio) | `@rlabs-inc/gemini-mcp` | API key |
| Google Workspace (Drive, Gmail, Calendar, Sheets, Docs) | `@googleworkspace/cli` | OAuth 2.0 |
| Firebase (Firestore, Auth, Storage) | `firebase-tools` | CLI login |
| Google Cloud (all GCP services) | `@google-cloud/gcloud-mcp` | ADC |
| Cloud Storage (buckets, objects) | `@google-cloud/storage-mcp` | ADC |
| NotebookLM (notebooks, podcasts) | `notebooklm-mcp-cli` | Browser cookies |
| Google Maps (code assistance) | `@googlemaps/code-assist-mcp` | None |

**Note:** Google Sheets and Docs are also accessible through the Workspace MCP server — just ask Claude naturally (e.g., "create a Google Doc titled Q1 Report"). Dedicated `/gfc:sheets` and `/gfc:docs` shortcuts may be added in a future version.

## Free Tier

Most services work with a free Google account. No credit card required to get started:

- **Image generation:** 500 images/day (Nano Banana Flash)
- **TTS:** Included in Gemini free tier
- **Audio transcription:** Included in Gemini free tier
- **Workspace:** Works with free Gmail accounts
- **Firebase:** Free Spark plan
- **Google Cloud:** $300 new-account credit
- **Maps:** Free experimental

**Paid only:** Video generation (Veo), Imagen 4, search grounding via API

> **Privacy note:** Gemini API free tier data may be used for model training. Enable billing for data privacy.

## Limitations

- **Consumer subscriptions don't grant API access.** If you pay for Gemini Advanced/Ultra, that subscription does not provide API access. The API has its own free tier and paid tiers via API key.
- **NotebookLM uses an unofficial API** that may break without notice if Google changes their internal endpoints.
- **Search grounding via API requires billing** — the free tier only works in Google AI Studio's playground.

## Companion Tool

Consider also installing [Gemini CLI](https://github.com/google-gemini/gemini-cli) for direct terminal access to Gemini models with a generous free tier (60 RPM, 1000 RPD):

```bash
npm install -g @google/gemini-cli
```

## Security

- This plugin **never stores your credentials** — it references environment variables and delegates auth to Google's own tools
- API keys go in your shell profile (`~/.bashrc`), not in project files
- OAuth tokens are managed by Google's CLIs in `~/.config/`
- Run `/gfc:status` to check credential health without exposing secrets

## License

MIT
