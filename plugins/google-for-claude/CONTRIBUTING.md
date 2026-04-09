# Contributing to Google for Claude (GFC)

Thanks for your interest in contributing! GFC is an open-source Claude Code plugin that makes Google AI and Cloud services accessible through simple commands.

## How to Contribute

### Reporting Issues

- Use [GitHub Issues](https://github.com/bobbyuzda1/google-for-claude/issues) to report bugs or request features
- Include your OS (Linux, WSL, macOS), Node.js version, and Claude Code version
- For setup issues, include which service failed and the error message

### Suggesting Features

- Open a [Feature Request](https://github.com/bobbyuzda1/google-for-claude/issues/new?template=feature_request.md) issue
- Describe the use case and what you'd like to see
- Check existing issues first to avoid duplicates

### Submitting Pull Requests

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes
4. Test by installing locally:
   ```
   /plugin marketplace add /path/to/your/fork
   /plugin install google-for-claude
   /reload-plugins
   ```
5. Commit with a descriptive message: `git commit -m "feat: add sheets shortcut skill"`
6. Push and open a PR against `main`

### What Can You Contribute?

- **New skills** — add shortcuts for Google services not yet covered (Sheets, Docs, etc.)
- **Setup improvements** — better detection, clearer instructions, platform-specific fixes
- **Playground enhancements** — UI improvements, new features, better status detection
- **Documentation** — clearer instructions, more examples, translations
- **Bug fixes** — especially platform-specific issues (WSL, macOS, different Linux distros)

## Project Structure

```
google-for-claude/
├── .claude-plugin/
│   ├── plugin.json          # Plugin manifest
│   └── marketplace.json     # Marketplace listing
├── .mcp.json                # Pre-wired MCP server configs
├── skills/                  # Claude-invoked skill definitions
│   └── <name>/SKILL.md
├── commands/                # User-invoked slash commands
│   └── <name>.md
├── playground/              # Visual dashboard
│   ├── server.js            # Node.js server (localhost:8764)
│   ├── index.html           # Mario-themed UI
│   └── logo-white.png       # Footer logo
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
└── LICENSE
```

### Adding a New Skill

1. Create `skills/<name>/SKILL.md` with frontmatter:
   ```markdown
   ---
   name: <name>
   description: Brief description for Claude to match against
   ---
   # Instructions for Claude...
   ```
2. Create `commands/<name>.md`:
   ```markdown
   ---
   description: "Brief description for autocomplete"
   argument-hint: "ARGS"
   ---
   Use the google-for-claude:<name> skill to handle this request. Arguments: $ARGUMENTS
   ```
3. Update README.md command table

## Code Style

- Skills are Markdown prompt files, not executable code — write clear instructions Claude can follow
- Keep the playground server lightweight — no external dependencies beyond Node.js built-ins
- Test on WSL if possible, since most Claude Code users are on WSL

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
