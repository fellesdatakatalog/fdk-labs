---
name: commit-push-branch
description: Create a new branch, commit the current changes, and push it — without opening a pull request. Use whenever the user wants work moved onto a fresh branch but has not asked for a PR — including paraphrases like "create a branch", "branch off", "move this to a new branch", "put this on its own branch", "start a new feature branch". Prefer this skill over running git/gh commands manually whenever a new branch + push is requested. If the user also wants a pull request, use create-branch-and-pr instead.
model: sonnet
---

# Git New Branch Workflow

1. Checkout main and pull latest
2. Resolve the username for the branch name:
   - Run `git config skill.username`
   - If empty, ask the user for their username and save it with `git config --global skill.username <provided-value>`
3. Create branch following template
4. Stage all, commit following template, never add Co-Authored-By. Commit message should be very short, max 50 characters
5. Push branch

### Rules

- Generate message based on the current diff
- Never commit or push directly to main
- Never add signatures or Co-Authored-By
- Always ask for confirmation before pushing to GitHub

## Branch name template

`<type>/<username>/<short-kebab-case-description>`

## Commit message template

`<type>: <description>`

Types: feat, fix, docs, style, refactor, test, chore
