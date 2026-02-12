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

The `set-username` script saves your username to `agent-skills/.username` (gitignored). Skills that need a username will read from this file at runtime.

## Available Commands

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `yarn set-username`  | Save your username for use in skills     |
| `yarn skills:add`    | Install skills to Claude Code            |
| `yarn skills:list`   | List available skills                    |

> **Tip:** When using `yarn skills:add`, it is recommended to choose the symlink option when prompted. This maintains a single source of truth, so any changes to skills in this repository are immediately reflected in Claude Code.

## License

Apache-2.0
