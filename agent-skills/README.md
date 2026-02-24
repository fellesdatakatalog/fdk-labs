# Agent Skills

Agent Skills Framework for AI-assisted development. This repository contains skill definitions that extend your agent with reusable workflows for common development tasks.

## Available Skills

| Skill                   | Description                                 |
| ----------------------- | ------------------------------------------- |
| `/commit-push`          | Stage, commit, and push to current branch   |
| `/commit-push-branch`   | Pull main, create branch, commit, and push  |
| `/create-pr`            | Generate pull request description and title |
| `/create-branch-and-pr` | Branch, commit, push, and create pull request |
| `/security-check-frontend` | Run npm audit and check Dependabot alerts |
| `/improve-prompt`       | Analyze and improve a prompt                |
| `/create-feature-issue` | Create GitHub feature issue                 |
| `/create-bug-issue`     | Create GitHub bug issue                     |
| `/create-ux-issue`      | Create GitHub UX issue                      |

## Creating New Skills

1. Create a new directory under `agent-skills/skills/` using kebab-case naming
2. Add a `SKILL.md` file with YAML frontmatter:

```yaml
---
name: skill-name
description: Short description shown in skill list
model: sonnet
argument-hint: [optional placeholder for arguments]
---
Your skill instructions here. Use $ARGUMENTS to reference user input.
```

3. Optionally add scripts under a `scripts/` subdirectory

## Directory Structure

```
agent-skills/
  skills/
    {skill-name}/
      SKILL.md              # Required: skill definition
      scripts/              # Optional: executable scripts
        {script-name}.sh
```

## License

Apache-2.0
