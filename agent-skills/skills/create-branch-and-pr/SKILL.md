---
name: create-branch-and-pr
description: Creates a new branch, commits changes, pushes, and opens a pull request. Use when the user says 'branch and PR', 'new branch with PR', or 'feature branch and pull request'.
model: sonnet
argument-hint: "[fixes #issue-number]"
---

# Git Branch and Pull Request Workflow

1. Checkout main and pull latest
2. Read the username by running: `git config skill.username`. If not found, ask user to run `scripts/set-username.sh` in fdk-labs to set it first
3. Create branch following the branch name template
4. Stage all, commit following the commit message template. Commit message should be very short, max 50 characters
5. Push branch
6. Write a short pull request title and description, then ask for confirmation before creating the PR

### Rules

- Generate messages based on the current diff
- Never commit or push directly to main
- Never add signatures or Co-Authored-By
- Keep PR text short
- Use bullet points for changes in the PR description
- Never include a test plan
- Always ask for confirmation before creating the PR in GitHub
- Do not create the PR until the user explicitly confirms
- Produce the PR description in the exact format below

## Branch name template

`<type>/<username>/<short-kebab-case-description>`

## Commit message template

`<type>: <description>`

## PR title

`<type>: <description>`

Types: feat, fix, docs, style, refactor, test, chore

### PR description output format (exact)

```text
# Summary $ARGUMENTS

- ...
- ...
```
