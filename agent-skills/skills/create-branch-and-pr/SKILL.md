---
name: create-branch-and-pr
description: Create a branch, commit, push, and open a pull request for the current changes. Use whenever the user wants work moved onto its own branch and a PR opened — including paraphrases like "branch and PR", "move it to a dedicated branch", "put this on its own branch/PR", "open a PR for this", "feature branch with a pull request". Prefer this skill over running git/gh commands manually whenever a branch + PR is requested.
model: sonnet
argument-hint: "[fixes #issue-number]"
---

# Git Branch and Pull Request Workflow

1. Checkout main and pull latest
2. Resolve the username for the branch name:
   - Run `git config skill.username`
   - If empty, ask the user for their username and save it with `git config --global skill.username <provided-value>`
3. Create branch following the branch name template
4. Stage all, commit following the commit message template. Commit message should be very short, max 50 characters
5. Push branch
6. Determine which issues (if any) this PR closes:
   - If `$ARGUMENTS` already names issues (e.g. `fixes #12`), use those.
   - Otherwise list open issues with `gh issue list --state open --limit 50 --json number,title,labels`
     and identify any the diff plausibly resolves (use `gh issue view <number>` to confirm scope).
   - Present the candidate issue(s) and **ask the user to confirm** which, if any, this PR should
     close. Never assume — if the user declines or none match, close nothing.
7. Write a short pull request title and description, add a `Closes #<number>` line for each confirmed
   issue, then ask for confirmation before creating the PR

### Rules

- Generate messages based on the current diff
- Never commit or push directly to main
- Never add signatures or Co-Authored-By
- Keep PR text short
- Use bullet points for changes in the PR description
- Never include a test plan
- Always check whether the change closes an open issue; confirm candidates with the user before
  adding them — never assume. Add each confirmed issue as a `Closes #<number>` line in the PR body.
- Always ask for confirmation before creating the PR in GitHub
- Do not create the PR until the user explicitly confirms
- Use `gh pr create` to create the PR
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
# Summary

- ...
- ...

Closes #<number>
```

Add one `Closes #<number>` line per confirmed issue. Omit the line entirely when the PR closes no
issue.
