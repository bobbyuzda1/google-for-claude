---
name: setup
description: Interactive setup wizard for Google AI & Cloud services. Detects existing config, installs prerequisites, walks through authentication. Use when user runs /gfc:setup or needs to configure Google services.
---

# Google for Claude — Setup Wizard

You are running the GFC setup wizard. Follow these phases exactly.

## Accepting Arguments

If the user provided a service name (e.g., `/gfc:setup gemini`, `/gfc:setup workspace`, `/gfc:setup firebase`, `/gfc:setup gcloud`, `/gfc:setup gcs`, `/gfc:setup notebooklm`, `/gfc:setup maps`), skip to the relevant browser step in Phase 4 for that service only. This is used for partial setup and re-authentication. Note: `gcs` routes to the gcloud auth step since Cloud Storage uses ADC.

If no argument, run the full setup flow below.

## Phase 1 — Detect Existing State

Run these commands and report what is already configured:

1. `node --version` — check Node.js 18+ is installed
2. `gcloud --version` — check gcloud CLI is installed
3. `echo $GEMINI_API_KEY` — check if Gemini API key is set (DO NOT echo the actual value to the user — just report "set" or "not set")
4. `test -f ~/.config/gcloud/application_default_credentials.json && echo "exists" || echo "missing"` — check ADC
5. `npx firebase-tools --version 2>/dev/null` — check firebase-tools
6. `gws --version 2>/dev/null` — check Workspace CLI
7. `uvx --from notebooklm-mcp-cli notebooklm-mcp --version 2>/dev/null` — check NotebookLM
8. `python3 --version` — check Python 3
9. `uv --version` — check uv

Report a summary like: "4 of 7 services already configured. Setting up the rest."

## Phase 2 — Auto-Install Prerequisites

For any missing prerequisites, install them automatically. Report what you're installing but proceed without asking — these are standard CLI tools the user has already opted into by running setup.

- **Node.js missing:** "Node.js 18+ is required. Install it with `nvm install --lts` or from nodejs.org."
- **gcloud CLI missing:** Run `curl https://sdk.cloud.google.com | bash` then `exec -l $SHELL`
- **firebase-tools missing:** Run `npm install -g firebase-tools`
- **Workspace CLI missing:** Run `npm install -g @googleworkspace/cli`
- **Python 3 missing:** "Python 3 is required for NotebookLM. Install it from python.org or your package manager."
- **uv missing:** Run `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **notebooklm-mcp-cli missing:** Run `uv tool install notebooklm-mcp-cli`

## Phase 3 — Service Selection

Present all 7 services and ask which ones the user wants to enable:

> Which Google services would you like to set up? (All are included — uncheck any you don't need)
>
> 1. [x] **Gemini** — image gen, video gen, TTS, music, search grounding, audio transcription
> 2. [x] **Google Workspace** — Drive, Gmail, Calendar, Sheets, Docs
> 3. [x] **Firebase** — Firestore, Auth, Storage, Hosting, Crashlytics
> 4. [x] **Google Cloud** — Compute, Cloud Run, BigQuery, and all GCP services
> 5. [x] **Google Cloud Storage** — bucket and object management
> 6. [x] **NotebookLM** — notebooks, podcasts, quizzes (uses unofficial API)
> 7. [x] **Google Maps** — code assistance (free experimental, no auth needed)
>
> Reply with the numbers to toggle off, or "all" to keep everything.

Skip subsequent steps for any unchecked services.

## Phase 4 — Browser Steps

Walk through each step sequentially. Wait for the user to confirm completion before moving on. Validate after each step.

### Step 1: Google Cloud Project (required for Gemini, GCloud, GCS, Firebase)

> Do you have an existing Google Cloud project? If yes, tell me the project ID. If not, run:
> ```
> gcloud projects create my-ai-hub --name="AI Hub"
> gcloud config set project my-ai-hub
> ```

After project is set, enable required APIs:
```
gcloud services enable aiplatform.googleapis.com generativelanguage.googleapis.com
```

Validate: Run `gcloud config get-value project` and confirm it returns a project ID.

### Step 2: Gemini API Key (if Gemini selected)

> Open **aistudio.google.com/apikey** in your browser, click "Create API key", select your project, and paste the key here.

IMPORTANT: When the user pastes the key, do NOT echo it back. Immediately guide them to save it:

> Add this to your shell profile (`~/.bashrc` or `~/.zshrc`):
> ```
> export GEMINI_API_KEY="<the key>"
> ```
> Then run `source ~/.bashrc` (or `source ~/.zshrc`).

Validate: Run a minimal test — `curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY" | head -1` should return JSON, not an error.

### Step 3: gcloud Authentication (if GCloud, GCS, or Firebase selected)

> Run these commands one at a time. Each will open your browser:
> ```
> gcloud auth login
> gcloud auth application-default login
> gcloud auth application-default set-quota-project <your-project-id>
> ```

Validate: `test -f ~/.config/gcloud/application_default_credentials.json && echo "ADC configured"`.

### Step 4: Workspace OAuth (if Workspace selected)

> Run these commands:
> ```
> gws auth setup
> ```
> This will walk you through creating an OAuth client in Google Cloud Console. Follow the prompts.
> Then:
> ```
> gws auth login
> ```

Validate: Run `gws drive files list --limit 1` and check for a successful response.

### Step 5: Firebase Login (if Firebase selected)

> Run:
> ```
> firebase login
> ```
> This opens your browser for authentication.

Validate: Run `firebase projects:list` and check for a successful response.

### Step 6: NotebookLM Login (if NotebookLM selected)

> Run:
> ```
> nlm login
> ```
> This extracts session cookies from Chrome. You must be logged into Google in Chrome.
>
> **Note:** NotebookLM MCP uses reverse-engineered APIs — it may break without notice if Google changes their internal API.

Validate: Confirm `nlm login` completed without errors.

## Phase 5 — Security Reminders

After all auth steps are complete, display:

> **Security reminders:**
> - Never commit API keys to git — always use environment variables
> - Your `GEMINI_API_KEY` is in `~/.bashrc` — keep this file secure
> - OAuth tokens are stored in `~/.config/` — don't share this directory
> - If you suspect a key is compromised, revoke it at aistudio.google.com/apikey
> - **Free tier privacy:** Gemini API free tier data may be used for model training. Enable billing (pay-as-you-go) for data privacy and higher rate limits.
> - Run `/gfc:status` anytime to check your credential health

## Phase 6 — Output Preference

> Where should generated files (images, audio, video) be saved?
> - Default: `./gfc-output/` in your current project
> - Or enter a custom path
>
> (You can change this later by editing `~/.config/gfc/preferences.json`)

Save the preference by creating `~/.config/gfc/preferences.json`:
```json
{
  "outputPath": "./gfc-output/"
}
```

## Phase 7 — Done

Summarize what was configured:

> **Setup complete!**
> - Gemini: configured
> - Workspace: configured
> - Firebase: configured
> - Google Cloud: configured
> - Cloud Storage: configured
> - NotebookLM: configured
> - Google Maps: configured (no auth needed)
>
> Run `/gfc:status` to verify everything, or try a command like `/gfc:image "a sunset over mountains"`.
