# Google Workspace Services Reference

The `gws` MCP server exposes **13 Google Workspace APIs** through a single OAuth connection. You don't need individual setup for each — one `gws auth setup` grants access to all enabled scopes.

This doc explains what each service can do through Claude Code, whether it works on free Gmail vs requires paid Workspace, and common use cases.

## Quick Recommendation

| Category | Services | Enable? |
|---|---|---|
| **Core (enable all)** | Drive, Gmail, Calendar, Sheets, Docs, Slides, Tasks, People, Forms, Keep | ✅ Always |
| **Developer tool** | Apps Script | ✅ Always |
| **Workspace paid** | Chat, Meet | ⚠️ Only if you have a paid Workspace account |
| **Admin-only** | Vault, Admin SDK, Cloud Identity, Groups Settings, Reseller, Licensing, Alert Center, Classroom | ❌ Skip unless admin |
| **Unrelated** | Cloud Pub/Sub | ❌ Not a Workspace service |

---

## Core Services

### 📁 Google Drive (`drive.googleapis.com`)
**What Claude can do:** Search files by name/content, list folders, read file contents, create/move/rename files, share files, manage permissions, download Drive files to local disk.

**Free Gmail?** ✅ Yes, fully supported.

**Common use cases:**
- "Find all reports I created last week"
- "Download the quarterly spreadsheet and analyze it"
- "Create a new folder for the Q2 project and move these files in"
- "Who has access to this document?"

### 📧 Gmail (`gmail.googleapis.com`)
**What Claude can do:** Search emails, read messages, list inbox/unread, draft and send emails, manage labels, filter and archive, download attachments.

**Free Gmail?** ✅ Yes, fully supported.

**Common use cases:**
- "Summarize my unread emails from the last 24 hours"
- "Find the invoice from Acme Corp last month"
- "Draft a reply to the latest message from Sarah"
- "Archive all emails from newsletter@"

### 📅 Google Calendar (`calendar-json.googleapis.com`)
**What Claude can do:** List events, search by date/title/attendees, create/update/delete events, check availability, send invites, manage multiple calendars.

**Free Gmail?** ✅ Yes, fully supported.

**Common use cases:**
- "What's on my calendar this week?"
- "Schedule a meeting with John at 2pm Friday"
- "Find a time everyone is free next week"
- "Cancel all events tomorrow"

### 📊 Google Sheets (`sheets.googleapis.com`)
**What Claude can do:** Read/write cells, create sheets, format data, apply formulas, read as CSV/JSON, bulk updates, create charts.

**Free Gmail?** ✅ Yes, fully supported.

**Common use cases:**
- "Read the sales data from that spreadsheet and find trends"
- "Update the project tracker with these new tasks"
- "Create a new sheet with this CSV data"
- "Add a conditional format to highlight overdue items"

### 📄 Google Docs (`docs.googleapis.com`)
**What Claude can do:** Create/read/update documents, insert text, apply formatting, add headings, insert images, manage comments.

**Free Gmail?** ✅ Yes, fully supported.

**Common use cases:**
- "Create a Google Doc titled Q1 Report with these sections"
- "Read the spec document and summarize it"
- "Add a new section to the meeting notes"
- "Pull all comments on this doc and list them"

### 🎞️ Google Slides (`slides.googleapis.com`)
**What Claude can do:** Create presentations, add slides, update text boxes, insert images, apply layouts, manage speaker notes.

**Free Gmail?** ✅ Yes, fully supported.

**Common use cases:**
- "Generate a 10-slide pitch deck about GFC"
- "Update the title slide with today's date"
- "Extract speaker notes from this presentation"
- "Create slides from the contents of this markdown file"

### ✓ Google Tasks (`tasks.googleapis.com`)
**What Claude can do:** List task lists, create/update/complete/delete tasks, set due dates, manage hierarchies.

**Free Gmail?** ✅ Yes, fully supported.

**Common use cases:**
- "Add 'Review PR #123' to my todo list due tomorrow"
- "What's on my task list?"
- "Mark all completed tasks from last week as done"

### 👥 People / Contacts (`people.googleapis.com`)
**What Claude can do:** Search contacts, get contact details, create/update contacts, manage groups.

**Free Gmail?** ✅ Yes, fully supported.

**Common use cases:**
- "Get John Smith's email address"
- "Add this new contact"
- "Who are my frequent contacts?"

Note: Required if you want to "email [person]" by name — Claude needs to look up the address.

### 📝 Google Forms (`forms.googleapis.com`)
**What Claude can do:** Create forms, read responses, update questions, manage settings.

**Free Gmail?** ✅ Yes, fully supported.

**Common use cases:**
- "Create a feedback form with these 5 questions"
- "Pull all responses from the survey"
- "Add a new question to the existing form"

### 📓 Google Keep (`keep.googleapis.com`)
**What Claude can do:** Read, create, and update notes.

**Free Gmail?** ✅ Yes, fully supported.

**Common use cases:**
- "Save this as a Keep note"
- "Show me all my Keep notes tagged 'ideas'"

---

## Developer Tool

### 📜 Apps Script (`script.googleapis.com`)
**What Claude can do:** Pull Apps Script project source code, edit scripts, deploy new versions, run functions, read execution logs, manage deployments.

**Free Gmail?** ✅ Yes, fully supported.

**One-time extra setup:** You must enable the Apps Script API at **script.google.com/home/usersettings** — it's a single toggle. Do this once per Google account.

**Common use cases:**
- "Pull my Apps Script project and fix the bug in the onEdit trigger"
- "Deploy the latest version of my script"
- "Create a new Apps Script that syncs data between these two sheets"
- "Show me the execution log for yesterday's runs"

**Why it matters:** Apps Script projects usually live trapped in the browser editor. GFC + Claude Code turns this into a real terminal-based development workflow — version control, AI-assisted refactoring, automated testing.

---

## Workspace Paid Only

These require a **Google Workspace subscription** (Business Starter $6/user/mo and up). They'll fail on free Gmail accounts.

### 💬 Google Chat (`chat.googleapis.com`)
**What Claude can do:** Send messages to Chat spaces, read message history, create/manage spaces, add members, build Chat bots.

**Free Gmail?** ❌ No — requires Workspace.

**Common use cases:**
- "Post a deployment summary to the #engineering space"
- "Create a new space for the Q2 project and invite the team"
- "Read the last 20 messages in #incidents"

### 🎥 Google Meet (`meet.googleapis.com`)
**What Claude can do:** Create/schedule Meet links, get meeting metadata, list participants. With **Business Standard+** ($12/user/mo): access meeting **recordings and transcripts**.

**Free Gmail?** ⚠️ Limited — can create basic meeting links, but no transcripts/recordings.

**Common use cases (paid Workspace):**
- "Schedule a Meet with the team Thursday at 10am"
- "Pull the transcript from yesterday's sprint planning and summarize action items"
- "List all meeting recordings from last week"

**Killer feature:** Transcript access turns every meeting into searchable, AI-summarizable content.

---

## Admin-Only Services (Skip)

These require Workspace admin privileges and usually fail with "insufficient permissions" for regular users. Skip unless you're a Workspace admin:

- **Google Vault** — compliance/eDiscovery
- **Admin SDK** — user/device management
- **Cloud Identity** — identity management
- **Groups Settings** — Google Groups administration
- **Reseller** — Google Cloud Partner only
- **Licensing** — license management
- **Alert Center** — security alerts
- **Classroom** — Google for Education accounts only

---

## Not a Workspace Service

- **Cloud Pub/Sub** — a Google Cloud messaging service, unrelated to Workspace. If you need Pub/Sub, use the `gcloud` MCP server instead.

---

## OAuth Consent Setup — Internal vs External

When you run `gws auth setup`, the wizard creates an OAuth consent screen in Google Cloud Console. You'll be asked to pick **Audience**:

### Pick **Internal** if:
- You have a Google Workspace organization (custom domain, even with just one user)
- You want the simplest setup with no friction

**Why Internal is better when available:**
- ✅ No test user limits
- ✅ No 7-day refresh token expiry
- ✅ No app verification required
- ✅ No "unverified app" warning during OAuth
- ✅ Can enable RESTRICTED and SENSITIVE scopes (gmail.modify, gmail.send, chat.*) without verification

### Pick **External** if:
- You only have a personal Gmail account (no Workspace org)

**External caveats:**
- Must add yourself as a test user in the consent screen
- Refresh tokens expire every 7 days in testing mode (you'll need to re-auth weekly)
- "This app isn't verified" warning screen during OAuth flow
- Cannot use RESTRICTED scopes without Google verification (lengthy process)

## OAuth Scope Selection

After creating the OAuth client, `gws auth setup` shows a scope picker. The **Recommended (Core Consumer Scopes)** preset is selected by default — read/write access to Drive, Gmail, Calendar, Docs, Sheets, Slides, Tasks. This covers 95% of typical use cases.

### Power-User Scopes (Internal Apps Only)

If you picked Internal audience, you can safely enable these additional scopes (External requires Google verification for them):

| Scope | What it enables |
|---|---|
| `gmail.modify` | Draft, modify, and trash emails. Lets Claude manage your inbox. |
| `gmail.send` | Send emails on your behalf. Lets Claude send replies and new messages. |
| `chat.spaces` | Create and manage Google Chat spaces. |
| `chat.messages.create` | Post messages to Chat spaces. Useful for Chat bots and notifications. |

**Use Space to toggle, Enter to confirm.**

### ⚠️ Scope Count Limit

Google's OAuth consent flow fails (browser shows "Something went wrong") when too many scopes are requested at once. The practical limit is around **80 scopes**. If you enable all 13 APIs AND add power-user scopes, you'll likely hit ~91 scopes and the OAuth flow will fail.

**Workarounds:**

1. **Enable all 13 APIs but keep default scopes only** (~25-30 scopes total) — recommended for most users
2. **Drop a few APIs** (Forms, Keep, Tasks, Slides are common cuts) to stay under the limit while keeping power-user scopes
3. **Add power-user scopes later** without re-running setup:
   ```
   gws auth login --scopes drive,gmail,gmail.modify,gmail.send,calendar,sheets,docs
   ```

If you see "Something went wrong" in the browser during the OAuth flow, scope count is the most likely cause. Re-run `gws auth setup` and pick fewer scopes.

### Scope Categories Explained

- 🟢 **Recommended** — pre-selected, no verification needed
- 🟠 **SENSITIVE** — orange icons. Internal apps can enable freely. External needs verification.
- 🔴 **RESTRICTED** — red icons. Internal apps can enable freely. External needs lengthy "restricted scope verification."

## Changing Your Enabled Services Later

You can re-run `gws auth setup` to change which services you have access to. It'll update your OAuth client and re-authenticate.

Or to modify scopes without recreating the OAuth client:
```
gws auth login --services drive,gmail,calendar,sheets,docs,slides,tasks,people,forms,keep,script
```

To check current auth status:
```
gws auth status
```

## MCP Server Tool Count

⚠️ Each enabled service adds 10-80 MCP tools to Claude Code's context. Most MCP clients perform best with fewer than 50 tools loaded at once. If you enable everything, consider limiting with:

```json
{
  "gws": {
    "command": "gws",
    "args": ["mcp", "-s", "drive,gmail,calendar,sheets,docs"]
  }
}
```

The default GFC `.mcp.json` uses `drive,gmail,calendar,sheets,docs` — edit this to match your needs.
