---
name: commit-push-branch
description: Creates a new branch, commits changes, and pushes. Use when the user wants to 'create a branch', 'start a new feature', or 'branch off'.
model: sonnet
disable-model-invocation: true
---

# Git New Branch Workflow

1. Run `./scripts/get-user.sh` to get the username for the branch name
2. Checkout main and pull latest
3. Create branch following template (substitute the username from step 1)
4. Stage all, commit following template, never add Co-Authored-By. Commit message should be very short, max 50 characters
5. Push branch

### Rules

- Generate message based on the current diff
- Never commit or push directly to main
- Never add signatures or Co-Authored-By

## Branch name template

`<type>/$USER/<short-kebab-case-description>`

## Commit message template

`<type>: <description>`

Types: feat, fix, docs, style, refactor, test, chore
