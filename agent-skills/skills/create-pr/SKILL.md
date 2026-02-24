---
name: create-pr
description: Creates a pull request with auto-generated title and description. Use when the user says 'create PR', 'open pull request', or 'submit for review'.
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
