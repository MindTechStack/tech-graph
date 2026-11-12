---
id: commitizen
name: "Commitizen"
kind: tool
status: work
tags: [git, commitizen, conventional-commits, changelog, cli]
what: "CLI tool that prompts developers to fill out required commit fields according to the Conventional Commits specification."
why: "Standardizes `git commit` messages across teams (`feat:`, `fix:`, `refactor:`), enabling automated semantic versioning, `CHANGELOG.md` generation, and clean history."
problem: "Without enforced commit conventions, `git log` messages become inconsistent, vague, or messy, breaking automated release pipelines and making history hard to navigate."
relations:
  - { to: git, label: "formats commits for" }
links:
  - { title: "Commitizen CLI Repository", url: "https://github.com/commitizen/cz-cli" }
  - { title: "Conventional Commits Specification", url: "https://www.conventionalcommits.org/" }
alsoIn: []
source: work
---

## Example
```bash
# Install Commitizen and conventional changelog adapter locally
npm install --save-dev commitizen cz-conventional-changelog

# Initialize adapter in package.json
npx commitizen init cz-conventional-changelog --save-dev --save-exact

# Stage changes and run Commitizen interactive prompt instead of `git commit`
git add src/auth/jwt.ts
npx cz

# Interactive prompt output -> generates standardized commit:
# feat(auth): add JWT token refresh endpoint
#
# Generates short-lived access and long-lived refresh tokens.
# Closes #42
```

## Key points
- **Interactive Conventional Commits prompt**: guides developers through type (`feat`, `fix`, `refactor`, `docs`, `chore`), scope, subject, body, and breaking changes.
- **Automated releases & changelogs**: structured commits allow tools like `standard-version` or `semantic-release` to bump SemVer versions and generate `CHANGELOG.md` automatically.
- **Git hook enforcement**: paired with tools like `commitlint` and `husky` on the `commit-msg` hook to guarantee no malformed commits enter the repository.
