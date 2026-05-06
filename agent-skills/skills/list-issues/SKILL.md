---
name: list-issues
description: Lists GitHub issues assigned to the current user from project informasjonsforvaltning/9, rendered as a Markdown table. Use when the user says "list my issues", "my issues", "issues assigned to me", "current sprint issues", or "previous sprint issues".
model: sonnet
argument-hint: [natural language filter, e.g. "current sprint" or "include done"]
allowed-tools: Bash(gh project item-list:*), Bash(gh api:*), Bash(date:*), Bash(jq:*)
---

> **Scope**: hardcoded to org `informasjonsforvaltning`, project `9`. Edit this file to point at a different board.

## Steps

1. **Get the current user** — `gh api user --jq .login`. Save as `$ME`. On error, surface stderr verbatim and stop.

2. **Resolve sprint** (only if `$ARGUMENTS` mentions sprint or iteration). `gh project field-list --format json` does not return iteration config; use GraphQL:
   ```bash
   gh api graphql -f query='{ organization(login:"informasjonsforvaltning") { projectV2(number:9) { fields(first:50) { nodes { ... on ProjectV2IterationField { name configuration { iterations { title startDate duration } completedIterations { title startDate duration } } } } } } } }'
   ```
   Iteration entries have `{title, startDate, duration}`.
   - **Current** = entry in `iterations` where `startDate <= today < startDate + duration days` (today via `date -u +%Y-%m-%d`).
   - **Previous** = last entry of `completedIterations` (sorted by `startDate` desc).
   - No current iteration matches → report "No active sprint on `<today>`" and stop unless `$ARGUMENTS` asked for previous.

3. **Fetch project items** — `gh project item-list 9 --owner informasjonsforvaltning --format json --limit 200`. Custom fields are flattened with lowercase, no-space keys: `status` (string, often emoji-prefixed like `"🏗 In progress"`), `sprint` (object with `title`, `startDate`, `duration`); unset fields are omitted. If `totalCount` exceeds returned `items` length, re-fetch with `--limit $totalCount` (rounded up to nearest 100). Do not proceed with truncated data.

4. **Filter** in order:
   1. `content.type == "Issue"` — skip DraftIssue and PullRequest.
   2. `$ME` is in `assignees` (array of login strings).
   3. **Default**: status does not contain `done` (case-insensitive substring, to tolerate emoji prefixes like `✅ Done`). Override only if `$ARGUMENTS` contains "include done", "all", or "done only" — and state the override in the scope line.
   4. Sprint filter from step 2 if asked. `"no sprint"` → `sprint == null`.
   5. Free-form intent like "in review only" → status contains `in review` (case-insensitive substring). Apply the same tolerant matching for any status filter.

5. **Sort** by status, then by issue number ascending. Status order (case-insensitive substring against the emoji-prefixed value): New, Todo, Ready, In Progress, In Review, Blocked, Done. Unknown statuses sort last.

## Output format

```text
## Issues assigned to @<login>
Scope: <e.g. "open, current sprint (Uke 19, 2026-05-04 → 2026-05-10)">

| #   | Title                | Status      |
| --- | -------------------- | ----------- |
| [#1234](https://github.com/.../issues/1234) | Fix login redirect | In Progress |

_N issues._
```

## Rules

- Link `#NUMBER` to `content.url`. Plain `#1234` if URL missing.
- Escape `|` in titles as `\|`.
- Zero matches → print scope line + `_No matching issues._` (no empty table).
- If `$ARGUMENTS` was non-trivial, summarize the chosen interpretation in the scope line.
- Custom field key mismatch (no `sprint` or `status` on items) → run `gh project field-list` and report which field name is unexpected.
- Hardcoded org/project — do not accept overrides via `$ARGUMENTS`.
