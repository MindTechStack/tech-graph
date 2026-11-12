---
id: gitbutler
name: "GitButler"
kind: tool
status: work
tags: [git, gitbutler, virtual-branches, vcs, workflow]
what: "Next-generation Git client and branch management tool built around virtual branches for concurrent task development."
why: "Allows working on multiple independent features or bugfixes simultaneously in the same working directory without constant `git stash`, `git checkout`, or context switching."
problem: "Standard Git forces developers to switch branches or stash uncommitted changes whenever an urgent fix or concurrent task arises, disrupting focus and causing merge conflicts."
relations:
  - { to: git, label: "virtual branch workflow for" }
links:
  - { title: "GitButler Official Site", url: "https://gitbutler.com/" }
  - { title: "GitButler Documentation", url: "https://docs.gitbutler.com/" }
alsoIn: []
source: work
---

## Example
```bash
# Inspect active virtual branches and uncommitted file diffs in the workspace
but status

# Create two parallel virtual branches in the same working tree (on `gitbutler/workspace`)
but branch new feat/oauth-login
but branch new fix/invoice-tax

# Commit specific changes directly to their target virtual branch without `git checkout`
but commit feat/oauth-login -m "feat(auth): add OAuth2 callback handler"
but commit fix/invoice-tax -m "fix(billing): round VAT calculation to 2 decimals"

# Push each virtual branch independently to remote and open separate PRs
but push feat/oauth-login
but push fix/invoice-tax
```

## Key points
- **Virtual branches**: work on several distinct branches at the same time in a single working directory (`gitbutler/workspace`) without checking out branches or stashing diffs.
- **Hunk-level branch assignment**: drag and drop specific code hunks or files into separate virtual branches (or commit via `but` CLI) and push each as an independent pull request.
- **Seamless Git compatibility**: stores virtual branch state on top of standard Git objects; upstream branches remain regular Git commits compatible with any remote host.
