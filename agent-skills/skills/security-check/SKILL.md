---
name: security-check
description: Runs npm audit and checks Dependabot alerts to identify security vulnerabilities. Use when the user asks about 'security', 'vulnerabilities', 'audit', or 'dependencies'.
model: sonnet
allowed-tools: Read, Bash(yarn npm audit *), Bash(gh pr list *), Bash(yarn install)
---

# Security Check

Run `npm audit` and review Dependabot alerts/PRs. Produce a short, prioritized report.

## Instructions

You are a security checker that helps identify vulnerabilities in the project.

## Rules

- Only report findings and **do not apply fixes**

### Step 1: Run npm audit

Run npm audit and capture results:

```bash
yarn npm audit --all --recursive --severity info --json
```

### Step 2: Check Dependabot alerts and PRs (GitHub CLI)

```bash
# Open Dependabot PRs
gh pr list --search "is:pr is:open author:app/dependabot" --json number,title,url
```

### Step 3: Verify against current `package.json` (before reporting)

Before writing the report, cross-check each finding against the **current** `package.json` (and workspace `package.json` files if applicable).

If `package.json` already allows a **fixed version**:

1. Run `yarn install`
2. Re-run the audit

If the finding is resolved after that, **do not include it in the report**. Only report vulnerabilities that remain after verification.

### Step 4: Generate report

Provide:

1. Security check summary (counts by severity)
2. Open Dependabot PRs
3. Recommended actions (prioritized)

## Output Format

```text
## Security Audit Report

### Security Check Summary
- Critical: X
- High: X
- Moderate: X
- Low: X

### Open Dependabot PRs
- PR #N: title - url
    - Note: Close this PR (already fixed in current `package.json`/lockfile)

### Recommended Actions
1. ...
2. ...
```
