---
name: commit-push
description: Commit and push the current changes to the branch you're already on (no new branch, no PR). Use whenever the user wants their work saved and pushed in place — including paraphrases like "commit", "commit and push", "push this", "push my changes", "save my work", "ship what I have". Prefer this skill over running git commands manually whenever a commit + push is requested. For a new branch use commit-push-branch; for a branch plus a pull request use create-branch-and-pr.
model: sonnet
---

# Git Commit

1. Stage all changes in current branch
2. Stage all, commit following template, never add Co-Authored-By. Commit message should be very short, max 50 characters
3. Push branch

### Rules

- Generate message based on the current git diff and local changes
- Never commit or push directly to main
- Never add signatures or Co-Authored-By
- Always ask for confirmation before pushing to GitHub

### Commit message template

`<type>: <description>`

Types: feat, fix, docs, style, refactor, test, chore
