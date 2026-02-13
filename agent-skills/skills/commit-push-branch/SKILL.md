---
name: commit-push-branch
description: Creates a new branch, commits changes, and pushes. Use when the user wants to 'create a branch', 'start a new feature', or 'branch off'.
model: sonnet
---

# Git New Branch Workflow

1. Checkout main and pull latest
2. Read the username by running: `git config skill.username`. If not found, ask user to run `scripts/set-username.sh` in fdk-labs to set it first
3. Create branch following template
4. Stage all, commit following template, never add Co-Authored-By. Commit message should be very short, max 50 characters
5. Push branch

### Rules

- Generate message based on the current diff
- Never commit or push directly to main
- Never add signatures or Co-Authored-By

## Branch name template

`<type>/<username>/<short-kebab-case-description>`

## Commit message template

`<type>: <description>`

Types: feat, fix, docs, style, refactor, test, chore
