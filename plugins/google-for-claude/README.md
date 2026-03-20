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
/google-for-claude:setup
```

The wizard will:
1. Detect what you already have configured
2. Install missing prerequisites automatically (handles npm permissions, PATH updates)
3. Let you choose which services to enable
4. Create a dedicated GCP project (`gfc-ai-hub`) for clean billing/service separation
5. Walk you through browser-based authentication steps **in a separate terminal**
6. Validate each credential before moving on

### Setup Tips

- **Browser auth commands** (gcloud, gws, firebase, nlm) must be run in a **separate terminal**, not inside Claude Code
- The wizard will recommend creating a **new GCP project** — this keeps your GFC services and billing isolated
- **New projects** may need a billing account linked before image generation quota activates (you won't be charged on the free tier)
- If your new project doesn't appear in AI Studio's API key dropdown, click **"Import project"** to add it

## Quick Start

After setup, use these commands:

| Command | What it does |
|---|---|
| `/google-for-claude:image "a sunset"` | Generate an image (free) |
| `/google-for-claude:video "a timelapse"` | Generate a video (paid) |
| `/google-for-claude:tts "Hello world"` | Text-to-speech (free) |
| `/google-for-claude:music "jazz piano"` | Generate music (experimental) |
| `/google-for-claude:search "latest news"` | Search with Google grounding (paid) |
| `/google-for-claude:transcribe audio.mp3` | Transcribe audio (free) |
| `/google-for-claude:drive "find reports"` | Search Google Drive |
| `/google-for-claude:mail "unread"` | Check Gmail |
| `/google-for-claude:calendar "this week"` | View calendar events |
| `/google-for-claude:models` | Model ID reference |
| `/google-for-claude:status` | Check credential health |
| `/google-for-claude:setup` | Re-run setup wizard |

You can also just ask Claude naturally — e.g., "generate an image of a sunset using Gemini" — and the right skill will activate automatically.

## Override Flags

Some commands support flags for model selection:

- `/google-for-claude:image "prompt" --pro` — Use 4K Nano Banana Pro
- `/google-for-claude:image "prompt" --imagen` — Use Imagen 4 (paid)
- `/google-for-claude:tts "text" --voice Puck` — Use a specific voice
- `/google-for-claude:tts "text" --pro` — Use Pro TTS (higher fidelity)
- `/google-for-claude:video "prompt" --fast` — Use faster Veo variant
- `/google-for-claude:music "prompt" --bpm 120` — Set BPM for music generation
- `/google-for-claude:transcribe file.mp3 --speakers` — Include speaker labels
- `/google-for-claude:transcribe file.mp3 --timestamps` — Include timestamps

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

**Note:** Google Sheets and Docs are also accessible through the Workspace MCP server — just ask Claude naturally (e.g., "create a Google Doc titled Q1 Report"). Dedicated shortcuts may be added in a future version.

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

> **Privacy note:** Gemini API free tier data may be used for model training. Enable billing for data privacy and higher rate limits.

> **Billing tip:** Linking a billing account unlocks 10-100x higher rate limits and ensures data privacy. You won't be charged unless you exceed free tier limits.

## Limitations

- **Consumer subscriptions don't grant API access.** If you pay for Gemini Advanced/Ultra, that subscription does not provide API access. The API has its own free tier and paid tiers via API key.
- **NotebookLM uses an unofficial API** that may break without notice if Google changes their internal endpoints.
- **Search grounding via API requires billing** — the free tier only works in Google AI Studio's playground.
- **Veo cannot generate video from images with real faces** — Google's safety filter blocks reference images containing recognizable human faces. Use text-only prompts or stylized images instead.
- **New GCP projects may need billing linked** before image generation free tier quota activates.

## Companion Tool

Consider also installing [Gemini CLI](https://github.com/google-gemini/gemini-cli) for direct terminal access to Gemini models with a generous free tier (60 RPM, 1000 RPD):

```bash
npm install -g @google/gemini-cli
```

## Security

- This plugin **never stores your credentials** — it references environment variables and delegates auth to Google's own tools
- API keys go in your shell profile (`~/.bashrc`), not in project files
- OAuth tokens are managed by Google's CLIs in `~/.config/`
- Run `/google-for-claude:status` to check credential health without exposing secrets

## License

MIT
