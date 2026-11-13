---
id: codex
name: "OpenAI Codex"
kind: tool
status: work
tags: [ai, coding-agent, openai, cli, agentic]
what: "OpenAI's coding agent, shipped as an open-source CLI, an IDE extension and a cloud agent that runs tasks in sandboxes."
why: "Handles coding tasks locally under configurable sandbox and approval policies, or in the cloud in parallel, returning diffs and pull requests to review."
problem: "Letting an AI run arbitrary commands on a dev machine is risky without clear limits on what it can read, write, and reach over the network."
relations:
  - { to: mcp, label: "extended via" }
  - { to: agent-rules, label: "configured by" }
  - { to: claude-code, label: "alternative to" }
links:
  - { title: "Codex Documentation", url: "https://developers.openai.com/codex" }
  - { title: "Codex CLI GitHub", url: "https://github.com/openai/codex" }
alsoIn: []
source: work
---

## Example
```toml
# ~/.codex/config.toml
approval_policy = "on-request"   # ask before leaving the sandbox
sandbox_mode = "workspace-write" # may edit files in the repo, no network by default

[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
```

```bash
# Interactive session in the repo
codex

# Non-interactive run for scripts and CI
codex exec "Fix the failing lint errors in src/ and explain the changes"
```

## Key points
- **Sandbox + approvals**: `sandbox_mode` (`read-only`, `workspace-write`, `danger-full-access`) and `approval_policy` define exactly what the agent may do without asking.
- **AGENTS.md instructions**: Codex reads `AGENTS.md` files from the repo root down to the current directory, so nested folders can add or override rules.
- **Local and cloud modes**: the CLI/IDE work on your machine; cloud tasks run in parallel containers and come back as diffs or pull requests.
