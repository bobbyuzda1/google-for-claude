---
name: drive
description: Search, list, and manage Google Drive files. Use when user runs /gfc:drive or asks to find/manage files in Google Drive.
---

# Google for Claude — Google Drive

Interact with Google Drive using the `gws` MCP server.

## Parse Arguments

- **Query/Action:** Everything after `/gfc:drive`

## Before Acting

- If the `gws` MCP server is not available or returns an auth error, say: "Google Workspace is not authenticated. Run `/gfc:setup workspace` to configure."

## Actions

Use the `gws` MCP server's Drive tools to fulfill the user's request. Common actions include:
- Search for files by name or content
- List recent files
- Get file metadata
- Download or read file contents
- Create, move, or rename files

## Output

Display results inline in the conversation.

## Error Handling

If the MCP tool call fails, detect the error type and respond:

- **Auth missing/invalid:** "Google Workspace is not configured. Run `/gfc:setup workspace` to set it up."
- **Token expired:** "Your Workspace OAuth token has expired. Run `/gfc:setup workspace` to re-authenticate."
- **Rate limited (429):** "You've hit the Workspace API rate limit. Wait a moment and try again."
- **MCP server not responding:** "The gws MCP server isn't responding. Try restarting Claude Code or run `/gfc:status` to diagnose."

Never fail silently. Every error must point to a specific recovery action.
