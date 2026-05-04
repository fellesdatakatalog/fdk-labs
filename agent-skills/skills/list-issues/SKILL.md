---
name: list-issues
description: Lists GitHub issues assigned to the current user from project informasjonsforvaltning/9, rendered as a Markdown table. Use when the user says "list my issues", "my issues", "issues assigned to me", "current sprint issues", or "previous sprint issues".
model: sonnet
argument-hint: [natural language filter, e.g. "current sprint" or "include done"]
allowed-tools: Bash(gh project item-list:*), Bash(gh project field-list:*), Bash(gh api user:*), Bash(date:*), Bash(jq:*)
---

# List Issues

List GitHub issues assigned to the current user from the project board, rendered as a Markdown table. Filter via `$ARGUMENTS` using natural language: "current sprint", "previous sprint", "include done", "in review only", etc.

> **Scope**: hardcoded to org `informasjonsforvaltning`, project `9`. Edit this file to point at a different board.

## Steps

### 1. Get the current user

```bash
gh api user --jq .login
```

Save as `$ME`. If `gh` is not authenticated or returns an error, surface stderr verbatim and stop.

### 2. Resolve sprint (only if `$ARGUMENTS` mentions sprint or iteration)

```bash
gh project field-list 9 --owner informasjonsforvaltning --format json --limit 50
```

The Sprint field has shape:

```json
{
  "name": "Sprint",
  "type": "ProjectV2IterationField",
  "configuration": {
    "iterations":          [{ "title": "Sprint 43", "startDate": "2026-05-04", "duration": 14 }],
    "completedIterations": [{ "title": "Sprint 42", "startDate": "2026-04-20", "duration": 14 }]
  }
}
```

- **Current** = entry in `iterations` where `startDate <= today < startDate + duration days` (today via `date -u +%Y-%m-%d`).
- **Previous** = last entry of `completedIterations` (sorted by `startDate` desc).
- If no current iteration matches (sprint gap), report "No active sprint on `<today>`" and stop unless `$ARGUMENTS` asked for previous.

### 3. Fetch project items

```bash
gh project item-list 9 --owner informasjonsforvaltning --format json --limit 200
```

Custom fields are flattened with lowercase, no-space keys: `status` (string), `sprint` (object with `title`, `startDate`, `duration`). Unset fields are omitted from the item.

If `totalCount` exceeds `--limit`, warn: "Result may be truncated; bump `--limit`."

### 4. Filter

Apply in order:

1. `content.type == "Issue"` — skip DraftIssue and PullRequest.
2. `$ME` is in `content.assignees` (array of login strings).
3. **Default**: `status != "Done"`. Override only if `$ARGUMENTS` contains "include done", "all", or "done only" — and state the override in the scope line.
4. Sprint filter from step 2 if `$ARGUMENTS` asked for it. `"no sprint"` → `sprint == null`.
5. Free-form intent like "in review only" → `status == "In Review"` (match canonical Status values).

### 5. Sort

By status (Todo, In Progress, In Review, Blocked, Done), then by issue number ascending.

### 6. Render

Use the format below. If `$ARGUMENTS` was non-trivial, summarize the chosen interpretation in the scope line.

## Output format

```text
## Issues assigned to @<login>
Scope: <e.g. "open, current sprint (Sprint 43, 2026-04-27 → 2026-05-11)">

| #   | Title                | Status      |
| --- | -------------------- | ----------- |
| [#1234](https://github.com/.../issues/1234) | Fix login redirect | In Progress |

_N issues._
```

Rules:

- Link the `#NUMBER` cell to `content.url`. Plain `#1234` if URL missing.
- Escape `|` in titles as `\|`.
- Zero matches → print scope line + `_No matching issues._` (no empty table).

## Edge cases

- `gh` unauthenticated / no project access → surface stderr verbatim, stop.
- Custom field key mismatch (no `sprint` or `status` on items) → run `gh project field-list` and report which field name is unexpected.
- Hardcoded org/project — do not accept overrides via `$ARGUMENTS`.
