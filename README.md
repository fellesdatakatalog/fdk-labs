# fdk-labs

A collection of agent resources for AI-assisted development workflows.

## Resources

| Resource                                 | Description                       |
| ---------------------------------------- | --------------------------------- |
| [agent-skills](./agent-skills/README.md) | Skill definitions for Claude Code |

## Requirements

- Node.js >= 22.0.0
- Yarn 4

## Getting Started

```bash
yarn install
yarn set-username
```

The `set-username` script replaces `$username` placeholders across the skill files with your username. This is required before using the skills.

## Available Commands

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `yarn set-username`  | Set your username in skill files         |
| `yarn skills:add`    | Install skills to Claude Code            |
| `yarn skills:list`   | List available skills                    |

> **Tip:** When using `yarn skills:add`, it is recommended to choose the symlink option when prompted. This maintains a single source of truth, so any changes to skills in this repository are immediately reflected in Claude Code.

## License

Apache-2.0
