---
name: commit-push-branch
description: Creates a new branch, commits changes, and pushes. Use when the user wants to 'create a branch', 'start a new feature', or 'branch off'.
model: sonnet
disable-model-invocation: true
---

# Git New Branch Workflow

1. Checkout main and pull latest
2. Create branch following template
3. Stage all, commit following template, never add Co-Authored-By. Commit message should be very short, max 50 characters
4. Push branch

### Rules

- Generate message based on the current diff
- Never commit or push directly to main
- Never add signatures or Co-Authored-By

## Branch name template

`<type>/$username/<short-kebab-case-description>`

## Commit message template

`<type>: <description>`

Types: feat, fix, docs, style, refactor, test, chore
