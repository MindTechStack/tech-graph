---
id: git
name: "Git"
kind: tool
status: work
tags: [git, vcs, version-control, github, collaboration]
what: "A distributed version control system designed to track changes in source code across branches, commits, and collaborative developer teams."
why: "Enables atomic history tracking, non-linear branching and merging, code reviews, and automated CI/CD triggering upon repository pushes."
problem: "Without version control, team collaboration degrades into manual file copying, overwritten changes, untracked bugs, and inability to rollback regressions."
relations:
  - { to: github-actions, label: "integrates with" }
  - { to: gitlab-ci, label: "integrates with" }
  - { to: bruno, label: "integrates with" }
links:
  - { title: "Git Official Documentation", url: "https://git-scm.com/doc" }
  - { title: "Pro Git Book", url: "https://git-scm.com/book/en/v2" }
alsoIn: []
source: work
---

## Example
```bash
# Branch workflow: create feature branch, stage changes, commit with conventional style
git checkout -b feat/user-auth

# Stage specific files
git add src/auth/jwt.ts src/auth/login.ts

# Atomic conventional commit
git commit -m "feat(auth): implement JWT token generation and verification middleware"

# Rebase feature branch onto latest main before opening PR
git fetch origin
git rebase origin/main

# Push branch to remote and track upstream
git push -u origin feat/user-auth
```

## Key points
- **Atomic conventional commits**: write small, focused commits with structured messages (`feat:`, `fix:`, `refactor:`, `test:`) to maintain a readable git history and automate changelog generation.
- **Rebase vs Merge**: merge creates an explicit merge commit preserving branch topology; interactive rebase (`git rebase -i`) produces a linear, cleaner project history by replaying commits atop upstream.
- **Gitignore discipline**: always commit a comprehensive `.gitignore` before writing code to prevent leaking `.env` secrets, build artifacts (`dist/`), and `node_modules` into remote repositories.
