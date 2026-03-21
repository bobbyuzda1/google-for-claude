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
2. `which gcloud 2>/dev/null || echo "missing"` — check gcloud CLI is installed
3. `test -n "$GEMINI_API_KEY" && echo "set" || echo "not set"` — check if Gemini API key is set (DO NOT echo the actual value to the user — just report "set" or "not set")
4. `test -f ~/.config/gcloud/application_default_credentials.json && echo "exists" || echo "missing"` — check ADC
5. `npx firebase-tools --version 2>/dev/null` — check firebase-tools
6. `gws --version 2>/dev/null` — check Workspace CLI
7. `uvx --from notebooklm-mcp-cli notebooklm-mcp --version 2>/dev/null` — check NotebookLM
8. `python3 --version` — check Python 3
9. `uv --version` — check uv

Report a summary like: "4 of 7 services already configured. Setting up the rest."

## Phase 2 — Auto-Install Prerequisites

For any missing prerequisites, install them automatically. Report what you're installing but proceed without asking — these are standard CLI tools the user has already opted into by running setup.

### npm global install permissions fix

Before installing any npm packages globally, configure npm to use a local prefix to avoid permission errors:

```bash
mkdir -p ~/.npm-global
npm config set prefix ~/.npm-global
export PATH="$HOME/.npm-global/bin:$PATH"
```

Then append to the user's shell profile (`~/.bashrc` or `~/.zshrc`) if not already present:
```bash
export PATH="$HOME/.npm-global/bin:$HOME/.local/bin:$PATH"
```

### Install missing tools

- **Node.js missing:** "Node.js 18+ is required. Install it with `nvm install --lts` or from nodejs.org."
- **gcloud CLI missing:** Warn the user: "The gcloud CLI is a ~500MB download and may take a few minutes to install. It's required for Google Cloud, Cloud Storage, Firebase ADC, and creating a GCP project. If you only want Gemini with an existing project, you can skip this." Then run: `curl -sSL https://sdk.cloud.google.com | bash -s -- --disable-prompts --install-dir=$HOME` and add `$HOME/google-cloud-sdk/bin` to PATH.
- **firebase-tools missing:** Run `npm install -g firebase-tools`
- **Workspace CLI missing:** Run `npm install -g @googleworkspace/cli`
- **Python 3 missing:** "Python 3 is required for NotebookLM. Install it from python.org or your package manager."
- **uv missing:** Run `curl -LsSf https://astral.sh/uv/install.sh | sh` and add `$HOME/.local/bin` to PATH.
- **notebooklm-mcp-cli missing:** Run `uv tool install notebooklm-mcp-cli`

### Update PATH after installs

After all installs, run:
```bash
export PATH="$HOME/.npm-global/bin:$HOME/.local/bin:$HOME/google-cloud-sdk/bin:$PATH"
```
And ensure these paths are appended to the user's shell profile if not already present.

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

**IMPORTANT:** For any command that opens a browser or requires interactive input (`gcloud auth login`, `gws auth setup`, `firebase login`, `nlm login`), tell the user: **"Open a separate terminal (not this Claude Code session) and run:"** — these commands require interactive browser auth that cannot run inside Claude Code's terminal.

### Step 1: Google Cloud Project (required for Gemini, GCloud, GCS, Firebase)

First, check if the user has existing projects:
```bash
gcloud projects list
```

If projects exist, ask:
> I found these existing projects: [list them]. Would you like to use one of these, or create a new dedicated project for GFC?
>
> **We recommend creating a new project** so all your GFC services and billing are in one place.

If creating a new project (the default recommendation):
> **Note:** Google doesn't allow the word "google" in project IDs.
>
> Run:
> ```
> gcloud projects create gfc-ai-hub --name="GFC AI Hub"
> gcloud config set project gfc-ai-hub
> ```

If using an existing project:
```
gcloud config set project <their-project-id>
```

After project is set, enable required APIs:
```
gcloud services enable aiplatform.googleapis.com generativelanguage.googleapis.com
```

Validate: Run `gcloud config get-value project` and confirm it returns a project ID.

### Step 2: gcloud Authentication (if GCloud, GCS, or Firebase selected)

> Open a **separate terminal** (not this Claude Code session) and run these commands one at a time:
> ```
> gcloud auth login
> gcloud auth application-default login
> gcloud auth application-default set-quota-project <your-project-id>
> ```

Validate: `test -f ~/.config/gcloud/application_default_credentials.json && echo "ADC configured"`.

### Step 3: Gemini API Key (if Gemini selected)

> Open **aistudio.google.com/apikey** in your browser, click "Create API key", and select your project (e.g., `gfc-ai-hub`).
>
> **If your new project doesn't appear** in the dropdown, click "Import project" or use the project selector to add it first.
>
> Paste the key here when you have it.

IMPORTANT: When the user pastes the key, do NOT echo it back. Immediately guide them to save it:

> Add this to your shell profile (`~/.bashrc` or `~/.zshrc`):
> ```
> export GEMINI_API_KEY="<the key>"
> ```
> Then run `source ~/.bashrc` (or `source ~/.zshrc`).

Validate: Run a minimal test — `curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY" | head -1` should return JSON, not an error.

After validation, mention:
> You're on the **free tier** (500 RPD, 10 RPM for Flash). This is fine to get started. If you want higher rate limits and data privacy (your data won't be used for model training), you can enable billing at **console.cloud.google.com/billing** — this is optional.
>
> **Note:** Some services (especially image generation on brand new projects) may require a billing account to be linked before the free tier quota activates. If you get a quota error, link a billing account — you still won't be charged unless you exceed free tier limits.

### Step 4: Workspace OAuth (if Workspace selected)

> Open a **separate terminal** (not this Claude Code session) and run:
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

> Open a **separate terminal** (not this Claude Code session) and run:
> ```
> firebase login
> ```
> This opens your browser for authentication.

Validate: Run `firebase projects:list` and check for a successful response.

### Step 6: NotebookLM Login (if NotebookLM selected)

First, check if the user is on WSL by running:
```bash
grep -qi microsoft /proc/version 2>/dev/null && echo "WSL" || echo "native"
```

**If native Linux (has a browser):**
> Open a **separate terminal** (not this Claude Code session) and run:
> ```
> nlm login
> ```

**If WSL (most common):**
> WSL doesn't have a browser, so run the login from **Windows PowerShell**:
>
> 1. Make sure Python is installed on Windows. In **PowerShell**, run `python --version`. If not found, download from **python.org/downloads** and install.
>
> 2. In **PowerShell**, install the NotebookLM CLI:
> ```
> pip install notebooklm-mcp-cli
> ```
> If you see a warning that Scripts is "not on PATH", that's fine — use the full path in the next step.
>
> 3. Authenticate. If `nlm login` isn't recognized, use the full path:
> ```
> %LOCALAPPDATA%\Python\pythoncore-3.14-64\Scripts\nlm login
> ```
> Chrome will open in a **new window** (not your existing browser). You'll need to **sign into Google again** in that window. After sign-in, it authenticates automatically.
>
> 4. Verify it worked:
> ```
> %LOCALAPPDATA%\Python\pythoncore-3.14-64\Scripts\nlm login --check
> ```
>
> 5. Copy credentials to WSL. Run this in your **WSL terminal**:
> ```bash
> mkdir -p ~/.notebooklm-mcp-cli/profiles/default && cp /mnt/c/Users/$USER/.notebooklm-mcp-cli/profiles/default/* ~/.notebooklm-mcp-cli/profiles/default/
> ```
> (If your WSL username differs from Windows, replace `$USER` with your Windows username.)

**Note:** NotebookLM MCP uses reverse-engineered APIs — it may break without notice if Google changes their internal API.

**Tip:** NotebookLM adds 35 tools to Claude Code — disable it when not in use to save context window. Use `@notebooklm-mcp` in Claude Code to toggle.

Validate: Run `nlm login --check` to confirm credentials are valid.

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
