---
name: search
description: Search the web with Google Search grounding via Gemini. Use when user runs /gfc:search or asks to search with Google grounding for current information.
---

# Google for Claude — Search Grounding

Query Gemini with Google Search grounding for up-to-date information.

## Parse Arguments

- **Query:** Everything after `/gfc:search`

## Before Searching

- **Always warn on first use per session:** "Search grounding via the API requires billing enabled — the free tier only works in Google AI Studio's playground, not via API. Cost is $14/1K queries. Continue? (yes/no)"
- If `GEMINI_API_KEY` is not set, stop and say: "Gemini API key not found. Run `/gfc:setup gemini` to configure."

## Search

Use the `gemini` MCP server tools to send the query to `gemini-2.5-flash` with the Google Search grounding tool enabled. This returns:
- The AI-generated answer
- Source URLs and inline citations
- Search metadata

## Output

Display results inline in the conversation — no file saved. Include source URLs.

## Error Handling

If the MCP tool call fails, detect the error type and respond:

- **Auth missing/invalid:** "Gemini is not configured. Run `/gfc:setup gemini` to set it up."
- **Token expired:** "Your Gemini credentials have expired. Run `/gfc:setup gemini` to re-authenticate."
- **Rate limited (429):** "You've hit the free tier rate limit. Wait a minute or enable billing for higher limits."
- **Wrong tier / billing required:** "Search grounding via API requires billing. Enable billing at console.cloud.google.com/billing."
- **MCP server not responding:** "The gemini MCP server isn't responding. Try restarting Claude Code or run `/gfc:status` to diagnose."

Never fail silently. Every error must point to a specific recovery action.
