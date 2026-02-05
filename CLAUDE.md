# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Agent Skills Framework repository containing skill definitions for Claude Code. Skills are Markdown files with YAML frontmatter that define AI agent behaviors for common development tasks.

## Directory Structure

```
agent-skills/
  skills/
    {skill-name}/           # kebab-case directory name
      SKILL.md              # Required: skill definition
      scripts/              # Optional: executable scripts
        {script-name}.sh    # Bash scripts (preferred)
```

## Naming Conventions

- **Skill directory**: `kebab-case` (e.g., `vercel-deploy`, `log-monitor`)
- **SKILL.md**: Always uppercase, always this exact filename
- **Scripts**: `kebab-case.sh` (e.g., `deploy.sh`, `fetch-logs.sh`)

## Available Skills

Invoke skills using `/skill-name`:

| Skill                   | Description                                     |
| ----------------------- | ----------------------------------------------- |
| `/commit-push`          | Stage, commit, and push to current branch       |
| `/commit-push-branch`   | Pull main, create branch, commit, and push      |
| `/create-pr`            | Generate pull request description and title     |
| `/security-check-frontend` | Run npm audit and check Dependabot alerts    |
| `/improve-prompt`       | Analyze and improve a prompt (arg: prompt text) |
| `/create-feature-issue` | Create GitHub feature issue (Norwegian)         |
| `/create-bug-issue`     | Create GitHub bug issue (Norwegian)             |
| `/create-ux-issue`      | Create GitHub UX issue (Norwegian)              |

## Skill File Format

Skills use YAML frontmatter with these fields:

```yaml
---
name: skill-name
description: Short description shown in skill list
model: sonnet
argument-hint: [optional placeholder for arguments]
---
```

Use `$ARGUMENTS` in the skill body to reference user-provided arguments.
