---
id: agent-rules
name: "Agent Rules & Skills"
kind: concept
status: work
tags: [ai, agents-md, claude-md, skills, rules, context-engineering]
what: "Project files (`AGENTS.md`, `CLAUDE.md`, rules, and `SKILL.md` skills) that give coding agents persistent instructions and reusable, on-demand know-how."
why: "Captures project conventions, commands, and workflows once, so every agent session follows them without re-explaining in each prompt."
problem: "Without written rules, agents guess the stack and conventions, repeat the same mistakes, and the developer re-types identical instructions every session."
relations:
  - { to: mcp, label: "complements" }
links:
  - { title: "AGENTS.md", url: "https://agents.md/" }
  - { title: "Claude Code Memory (CLAUDE.md)", url: "https://docs.anthropic.com/en/docs/claude-code/memory" }
  - { title: "Antigravity Skills", url: "https://antigravity.google/docs/skills" }
alsoIn: []
source: work
---

## Example
```markdown
<!-- AGENTS.md: always loaded, short and factual -->
# Project rules
- Stack: React 19 + TypeScript + Vite; content lives in `content/**/*.md`.
- Before finishing: run `npm run validate` and `npm test`.
- Content is English; planning docs are Russian.
```

```markdown
<!-- skills/add-node/SKILL.md: loaded only when the task matches the description -->
---
name: add-node
description: Use when adding a new technology node to the knowledge graph.
---
1. Copy `content/_TEMPLATE.md` to `content/<map>/<category>/<id>.md`.
2. Fill what / why / problem in one sentence each.
3. Add the node to `NODES.md` and run `npm run validate`.
```

## Key points
- **Rules vs skills**: rules (`AGENTS.md`, `CLAUDE.md`) are always in context, so keep them short; skills load progressively: only `name` + `description` up front, the full body only when relevant.
- **Tool-specific file names**: Codex and Antigravity read `AGENTS.md`, Claude Code reads `CLAUDE.md`; a one-line `CLAUDE.md` that points to `AGENTS.md` keeps a single source of truth.
- **Write facts, not wishes**: concrete commands, paths, and "never do X" rules work; vague advice ("write clean code") only wastes context.

