---
id: claude-code
name: "Claude Code"
kind: tool
status: work
core: true
tags: [ai, coding-agent, anthropic, claude, cli, agentic]
what: "Anthropic's agentic coding tool that runs in the terminal (and IDE/desktop), reads the codebase, executes commands, and edits files across a project."
why: "Delegates multi-step engineering tasks (refactors, bug hunts, test writing, reviews) to an agent that plans, acts, and verifies its own work inside the real repository."
problem: "Chat-based assistants only see pasted snippets, so the developer has to copy context in, copy code out, and manually run and verify every change."
relations:
  - { to: mcp, label: "extended via" }
  - { to: agent-rules, label: "configured by" }
links:
  - { title: "Claude Code Documentation", url: "https://docs.anthropic.com/en/docs/claude-code/overview" }
  - { title: "Claude Code GitHub", url: "https://github.com/anthropics/claude-code" }
alsoIn: []
source: work
---

## Example
```bash
# Start an interactive session in the project root
claude

# Generate a CLAUDE.md with project conventions, commands, and architecture
> /init

# Connect an MCP server (up-to-date library docs) for this project
claude mcp add context7 -- npx -y @upstash/context7-mcp

# Headless mode for scripts and CI: print the result and exit
claude -p "Run the test suite and summarize any failures" --output-format json
```

## Key points
- **Agent loop in the real repo**: reads files, runs shell commands, edits code, and re-runs tests until the task is done; permission modes (`default`, `acceptEdits`, `plan`) control how much it may do without asking.
- **Project memory**: `CLAUDE.md` is loaded into every session, so conventions, commands, and "don't do this" rules don't have to be repeated in each prompt.
- **Extensible**: slash commands, subagents, hooks, skills, and plugins live in `.claude/`, and MCP servers add external tools; keep `settings.local.json` out of git because it holds personal permissions.

