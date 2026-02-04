---
name: commit-push
description: Commits and pushes changes to the current branch. Use when the user says 'commit', 'push changes', 'save my work', or asks to push staged changes.
model: sonnet
disable-model-invocation: true
---

# Git Commit

1. Stage all changes in current branch
2. Stage all, commit following template, never add Co-Authored-By. Commit message should be very short, max 50 characters
3. Push branch

### Rules

- Generate message based on the current git diff and local changes
- Never commit or push directly to main
- Never add signatures or Co-Authored-By

### Commit message template

`<type>: <description>`

Types: feat, fix, docs, style, refactor, test, chore
