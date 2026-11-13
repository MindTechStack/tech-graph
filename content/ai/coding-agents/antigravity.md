---
id: antigravity
name: "Google Antigravity"
kind: tool
status: work
tags: [ai, coding-agent, google, gemini, ide, agentic]
what: "Google's agent-centred IDE, desktop app and `agy` CLI, where agents plan, write, run and check code across editor, terminal and browser."
why: "Runs several agents in parallel on separate tasks and reports progress through reviewable artifacts (plans, task lists, walkthroughs) instead of a raw chat log."
problem: "Classic autocomplete and chat assistants keep the developer in the loop for every step and offer no structured way to review or steer long-running autonomous work."
relations:
  - { to: mcp, label: "extended via" }
  - { to: agent-rules, label: "configured by" }
  - { to: claude-code, label: "alternative to" }
links:
  - { title: "Antigravity Documentation", url: "https://antigravity.google/docs" }
  - { title: "Antigravity Plugins", url: "https://antigravity.google/docs/plugins" }
alsoIn: []
source: work
---

## Example
```json
// .agents/plugins/rtk/hooks.json — a workspace plugin hook that rewrites
// every terminal command through rtk before the agent runs it
{
  "rtk-rewrite": {
    "enabled": true,
    "PreToolUse": [
      {
        "matcher": "run_command",
        "hooks": [{ "type": "command", "command": "rtk hook antigravity", "timeout": 10 }]
      }
    ]
  }
}
```

## Key points
- **Artifacts over chat**: agents produce plans, task lists, and walkthroughs you can comment on and approve, which makes long autonomous runs reviewable.
- **Customization as plugins**: skills, rules, hooks, and MCP servers are bundled into plugins under `.agents/plugins/<name>/` and enabled or disabled as one unit.
- **Sandboxed terminal**: commands run in a sandbox by default (workspace access, no network); anything outside it needs explicit approval.

