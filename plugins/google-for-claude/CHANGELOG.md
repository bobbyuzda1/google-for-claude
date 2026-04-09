# Changelog

All notable changes to Google for Claude (GFC) will be documented in this file.

## [1.0.0] — 2026-03-22

### Added
- **13 skills** — setup, status, image, video, tts, music, search, transcribe, drive, mail, calendar, models, playground
- **13 slash commands** — each skill has a matching `/google-for-claude:` command
- **7 MCP servers** — gemini, gws, firebase, gcloud, gcs, notebooklm, google-maps-code-assist
- **Interactive setup wizard** — detects existing config, auto-installs prerequisites, walks through browser auth
- **Visual playground dashboard** — Mario-themed browser UI at localhost:8764 with real-time status, setup modals, gamification
- **Smart defaults** — commands pick the best free model automatically, with override flags for power users
- **Error handling** — every command detects auth, rate limit, billing, and MCP errors with specific recovery actions
- **WSL support** — setup instructions handle WSL-specific quirks (npm permissions, PATH, NotebookLM browser auth)

### Setup improvements discovered during testing
- Reordered setup: gcloud CLI → GCP project → gcloud auth → Gemini API key (foundation first)
- npm global install permission fix with local prefix
- PATH updates after installs
- gcloud CLI size warning (~500MB)
- Browser auth commands explicitly require a separate terminal
- Default to creating new GCP project (`gfc-ai-hub`)
- "google" prohibited in GCP project IDs
- AI Studio project import instruction for new projects
- Billing tier upgrade option mentioned
- New projects may need billing linked for image gen quota
- Veo face filter warning
- Video download requires redirect following
- NotebookLM WSL flow: install on Windows, login there, copy credentials to WSL
