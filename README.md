# fdk-labs

A collection of agent resources for AI-assisted development workflows.

## Resources

| Resource                                 | Description                       |
| ---------------------------------------- | --------------------------------- |
| [agent-skills](./agent-skills/README.md) | Skill definitions for AI agents |

## Requirements

- Node.js >= 22.0.0
- Yarn 4

## Getting Started

```bash
yarn install
```

Skills that need a username (e.g., for branch names) will ask for it on first use and cache it in `git config --global skill.username`.

To set or override manually:

```bash
yarn set-username           # interactive prompt
yarn set-username myname    # non-interactive
```

## Available Commands

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `yarn set-username` | Set or override your username for skills |
| `yarn skills:add`   | Install skills to your agent         |
| `yarn skills:list`  | List available skills                |

> **Tip:** When using `yarn skills:add`, it is recommended to choose the symlink option when prompted. This maintains a single source of truth, so any changes to skills in this repository are immediately reflected in your agent.

## License

Apache-2.0
