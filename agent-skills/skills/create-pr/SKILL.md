---
name: create-pr
description: Open a pull request from the branch you're already on, with an auto-generated title and description. Use whenever the user wants a PR for an existing pushed branch — including paraphrases like "create PR", "open a pull request", "raise a PR", "submit for review", "put this up for review". Prefer this skill over running gh commands manually whenever a pull request is requested. If the work still needs its own branch first, use create-branch-and-pr instead.
model: sonnet
argument-hint: "[fixes #issue-number]"
---

Write a short pull request description and title for GitHub, then ask for confirmation before creating the PR.

### Rules

- Keep the text short
- Use bullet points for changes
- Never include a test plan
- Always ask for confirmation before creating the PR in GitHub
- Never add signatures or Co-Authored-By
- Do not create the PR until the user explicitly confirms.
- Use `gh pr create` to create the PR.
- Produce the PR description in the exact format below.

## PR title

`<type>: <description>`

Types: feat, fix, docs, style, refactor, test, chore

### PR description output format (exact)

```text
# Summary $ARGUMENTS

- ...
- ...
```
