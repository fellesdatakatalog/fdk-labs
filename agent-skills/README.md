# Agent Skills

The Skills framework for [`fdk-labs`](../README.md). This document covers what a Skill is, how to read one, and how to write your own.

## What is a Skill?

A Skill is a Markdown file with YAML frontmatter that Claude Code treats as a reusable slash-command. It lives at `agent-skills/skills/<kebab-name>/SKILL.md`. When you invoke `/<skill-name>`, the agent reads the frontmatter and follows the body, substituting any text you typed after the command for `$ARGUMENTS`.

## Catalog

| Command                    | Description                                   | Arguments             | Language |
| -------------------------- | --------------------------------------------- | --------------------- | -------- |
| `/commit-push`             | Stage, commit, and push to current branch     | —                     | EN       |
| `/commit-push-branch`      | Pull main, create branch, commit, and push    | —                     | EN       |
| `/create-pr`               | Generate pull request description and title   | `[fixes #issue]`      | EN       |
| `/create-branch-and-pr`    | Branch, commit, push, and create pull request | `[fixes #issue]`      | EN       |
| `/security-check-frontend` | Run `npm audit` and check Dependabot alerts   | —                     | EN       |
| `/security-check-python`   | Run `pip-audit` and check Dependabot alerts   | —                     | EN       |
| `/tree-shaking-js`         | Check for unused JS/Node dependencies         | —                     | EN       |
| `/improve-prompt`          | Analyse and improve a prompt                  | `[prompt to improve]` | EN       |
| `/create-feature-issue`    | Create GitHub feature issue                   | —                     | NO       |
| `/create-bug-issue`        | Create GitHub bug issue                       | —                     | NO       |
| `/create-ux-issue`         | Create GitHub UX issue                        | —                     | NO       |
| `/setup-reusable-workflow` | Migrate or bootstrap a caller for a reusable workflow | `[file \| 'new']` | EN       |

## Anatomy of a skill

```yaml
---
name: security-check-frontend
description: Runs npm audit and checks Dependabot alerts. Use when the user says 'security' or 'audit'.
model: sonnet
allowed-tools:
  - Read
  - Bash(yarn npm audit *)
  - Bash(gh pr list *)
argument-hint: [fixes #issue-number]
---

# Skill instructions go here. Use $ARGUMENTS for user input.
```

| Field           | Required | Purpose                                                                          |
| --------------- | -------- | -------------------------------------------------------------------------------- |
| `name`          | yes      | The slash-command users type (kebab-case).                                       |
| `description`   | yes      | One-liner shown in the skill list. Include trigger phrases the agent recognises. |
| `model`         | no       | Which Claude model to use.                                                       |
| `argument-hint` | no       | Placeholder shown in the UI for `$ARGUMENTS`.                                    |
| `allowed-tools` | no       | Restrict which tools (and Bash command patterns) the skill may use.              |

## Creating a new skill

1. `mkdir agent-skills/skills/my-new-skill`
2. Write `SKILL.md` with the frontmatter above
3. Optionally add `scripts/<name>.sh` for Bash helpers
4. `yarn skills:list` to confirm it's picked up
5. `yarn skills:add` (pick symlink) and invoke `/my-new-skill` in Claude Code

Symlinked skills pick up Markdown edits immediately — no rebuild, no restart.

## Conventions

- Directory: kebab-case (`commit-push`, not `CommitPush`)
- Filename: always `SKILL.md`, uppercase
- Scripts: kebab-case `.sh`, prefer Bash
- Body: imperative voice, numbered steps, an explicit `### Rules` block for guardrails, and an **Output Format** block when the agent should produce a specific shape
