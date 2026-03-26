---
name: tree-shaking-js
description: Checks for unused JS/Node dependencies and identifies quick-win removals. Use when the user asks about 'tree shaking', 'unused dependencies', 'cleanup dependencies', 'depcheck', or 'remove unused packages'.
model: sonnet
allowed-tools: Read, Glob, Bash(npx depcheck *), Bash(cat *), Bash(ls *)
---

# Dependency Cleanup (JS/Node)

Run `depcheck` to find unused dependencies, misplaced devDependencies, and quick-win removals. Produce a prioritized report with a removal plan.

## Rules

- Only report findings and **do not remove or modify any dependencies**
- Verify each finding against source code and config files before reporting — filter out false positives
- If a monorepo/workspace is detected, check each workspace package separately

### Step 1: Detect package manager and project structure

Determine the package manager by checking which lock file exists:

```bash
ls yarn.lock package-lock.json pnpm-lock.yaml 2>/dev/null
```

Check for workspaces by reading `package.json`:

```bash
cat package.json
```

Note the package manager and whether this is a monorepo for later steps.

### Step 2: Run depcheck

Run depcheck in JSON mode for parseable output:

```bash
npx depcheck --json
```

For monorepos, also run against each workspace package directory found via Glob.

The relevant JSON fields are:

- `dependencies` — unused dependencies (in `dependencies` but never imported)
- `devDependencies` — unused devDependencies
- `missing` — imported but not in `package.json`
- `using` — which files import each dependency

### Step 3: Verify findings and classify

Before reporting, cross-check each unused dependency:

1. **Read `package.json`** to see if the dependency is referenced in `scripts`, config fields (`babel`, `eslint`, `jest`, etc.), or `peerDependencies`
2. **Check for config files** (`.babelrc`, `.eslintrc`, `postcss.config.*`, `jest.config.*`, `vite.config.*`, `webpack.config.*`, etc.) that may reference the dependency implicitly
3. **Filter false positives**: Remove from the unused list any dependency that is:
   - A Babel preset/plugin referenced in Babel config
   - An ESLint plugin/config referenced in ESLint config
   - A `@types/*` package matching a used dependency
   - A PostCSS/webpack/Vite plugin referenced in build config
   - Referenced in `package.json` `scripts` field

Classify the remaining genuinely unused dependencies:

- **Quick win** — Safe to remove: not a build tool, not referenced in any config, not a transitive peer dependency
- **Needs investigation** — Possibly unused but is a build tool, plugin, or has config references that could not be fully verified
- **Misplaced** — Production dependency that is only used in test/dev files (should be `devDependencies`)

### Step 4: Generate report

Present findings in the exact format below.

## Output Format

```text
## Dependency Cleanup Report

### Quick Wins - Safe to Remove
| # | Package | Type | Reason |
|---|---------|------|--------|
| 1 | package-name | dependency | Not imported anywhere |

### Needs Investigation
| # | Package | Type | Note |
|---|---------|------|------|
| 1 | package-name | dependency | Build plugin — verify config |

### Misplaced Dependencies (move to devDependencies)
| # | Package | Used in |
|---|---------|---------|
| 1 | package-name | test files only |

### Missing Dependencies (imported but not declared)
| # | Package | Imported by |
|---|---------|-------------|
| 1 | package-name | src/file.ts |

### Removal Plan
1. Remove quick wins: `<pm> remove package-a package-b package-c`
2. Move to devDependencies: `<pm> remove package-d && <pm> add -D package-d`
3. Investigate before removing: package-e (check build config), package-f (check CI)

### Summary
- Quick wins: N packages
- Needs investigation: N packages
- Misplaced: N packages
- Missing: N packages
```
